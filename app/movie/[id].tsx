import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// Components
import { SlideUp } from "@/components/animations/SlideUp";
import { DirectorInfo } from "@/components/cast/DirectorInfo";
import { CastList } from "@/components/movie-detail/CastList";
import { CriticsMeter } from "@/components/movie-detail/CriticsMeter";
import { DownloadInfo } from "@/components/movie-detail/DownloadInfo";
import { GlassInfoCard } from "@/components/movie-detail/GlassInfoCard";
import { MovieQuiz } from "@/components/movie-detail/MovieQuiz";
import { ParallaxHeader } from "@/components/movie-detail/ParallaxHeader";
import { QuickInfoSheet } from "@/components/movie-detail/QuickInfoSheet";
import { RatingBadge } from "@/components/movie-detail/RatingBadge";
import { ShareButton } from "@/components/movie-detail/ShareButton";
import { SimilarMovies } from "@/components/movie-detail/SimilarMovies";
import { TrailerPlayer } from "@/components/movie-detail/TrailerPlayer";
import { VoteCount } from "@/components/movie-detail/VoteCount";
import { WatchProviders } from "@/components/movie-detail/WatchProviders";
import { AnimatedHeart } from "@/components/ui/AnimatedHeart";
import { MovieDetailSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks
import { useMovieCredits } from "@/hooks/useCast";
import { useExtraRatings } from "@/hooks/useExtraRatings";
import { useMovieDetail } from "@/hooks/useMovieDetail";
import { useMovieRecommendations } from "@/hooks/useRecommendations";
import { useTrailer } from "@/hooks/useTrailer";
import { useWatchProviders } from "@/hooks/useWatchProviders";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Movie } from "@/types/movie.types";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { scheduleMovieReleaseNotification } from "@/lib/notifications";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Film,
  Info,
  Play,
  Sparkles,
} from "lucide-react-native";
import Toast from "react-native-toast-message";

const { width: W } = Dimensions.get("window");
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movieId = parseInt(id, 10);

  const scrollY = useSharedValue(0);
  const [quickInfoVisible, setQuickInfoVisible] = useState(false);
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const { data: movie, isLoading } = useMovieDetail(movieId);
  const { trailerKey, hasTrailer, isPlayerVisible, openTrailer, closeTrailer } =
    useTrailer(movieId);
  const { toggle, isAdded } = useWatchlist();
  const { data: credits } = useMovieCredits(movieId);
  const { data: similarMovies, isLoading: isSimilarLoading } =
    useMovieRecommendations(movieId);
  const { data: extraRatings, isLoading: isRatingsLoading } = useExtraRatings(
    movie?.imdb_id || null,
  );
  const { data: watchProviders } = useWatchProviders(movieId);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const inWatchlist = movie ? isAdded(movie.id) : false;

  if (isLoading) return <MovieDetailSkeleton />;
  if (!movie) return null;

  const overview = movie.overview;
  const shortOverview = overview?.slice(0, 180);
  const hasMoreOverview = (overview?.length || 0) > 180;

  return (
    <View style={styles.container}>
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Parallax Header */}
        <ParallaxHeader movie={movie} scrollY={scrollY} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Action row */}
          <SlideUp delay={50}>
            <View style={styles.actionRow}>
              {/* Rating */}
              <RatingBadge rating={movie.vote_average} size="lg" showLabel />

              <View style={styles.actionBtns}>
                {/* Share */}
                <ShareButton
                  movieId={movie.id}
                  movieTitle={movie.title || ""}
                  overview={movie.overview}
                  variant="icon"
                />

                {/* Quick info */}
                <TouchableOpacity
                  style={styles.infoBtn}
                  onPress={() => setQuickInfoVisible(true)}
                >
                  <Info size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>

                {/* Watchlist heart */}
                <AnimatedHeart
                  isActive={inWatchlist}
                  onToggle={() =>
                    toggle({
                      ...movie,
                      genre_ids: movie.genres?.map((g) => g.id) || [],
                    } as Movie)
                  }
                  movieTitle={movie.title || ""}
                  size={28}
                />

                {/* Reminder Bell (for upcoming) */}
                {movie.release_date &&
                  new Date(movie.release_date) > new Date() && (
                    <TouchableOpacity
                      style={styles.reminderBtn}
                      onPress={async () => {
                        const id = await scheduleMovieReleaseNotification(
                          movie.title || "",
                          movie.release_date!,
                          movie.id,
                        );
                        if (id) {
                          Toast.show({
                            type: "success",
                            text1: "Reminder Set! 🔔",
                            text2: `We'll notify you on ${movie.release_date}`,
                          });
                        }
                      }}
                    >
                      <Bell size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </SlideUp>

          {/* Critics vs Audience Meter */}
          <SlideUp delay={70}>
            <View style={{ paddingHorizontal: SPACING.base }}>
              <CriticsMeter
                tmdbRating={movie.vote_average}
                imdbRating={extraRatings?.imdb || null}
                rtRating={extraRatings?.rottenTomatoes || null}
                isLoading={isRatingsLoading}
              />
            </View>
          </SlideUp>

          {/* Vote count */}
          <SlideUp delay={80}>
            <View style={styles.voteRow}>
              <VoteCount count={movie.vote_count} />
            </View>
          </SlideUp>

          {/* Watch Actions */}
          <SlideUp delay={100}>
            <View style={styles.watchActions}>
              <TouchableOpacity
                style={styles.watchBtn}
                onPress={() =>
                  router.push({
                    pathname: "/player/[id]",
                    params: { id: movie.id, type: "movie" },
                  })
                }
                activeOpacity={0.88}
              >
                <Play size={18} color="#fff" fill="#fff" />
                <Text style={styles.watchBtnText}>Watch Now</Text>
              </TouchableOpacity>

              {hasTrailer && (
                <TouchableOpacity
                  style={styles.trailerBtnSmall}
                  onPress={openTrailer}
                  activeOpacity={0.7}
                >
                  <Film size={16} color={COLORS.textPrimary} />
                  <Text style={styles.trailerBtnSmallText}>Trailer</Text>
                </TouchableOpacity>
              )}
            </View>
          </SlideUp>

          {/* Overview */}
          <SlideUp delay={120}>
            <View style={styles.overviewSection}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <Text style={styles.overview}>
                {overviewExpanded ? overview : shortOverview}
                {!overviewExpanded && hasMoreOverview && "..."}
              </Text>
              {hasMoreOverview && (
                <TouchableOpacity
                  style={styles.readMoreBtn}
                  onPress={() => setOverviewExpanded((e) => !e)}
                >
                  {overviewExpanded ? (
                    <ChevronUp size={14} color={COLORS.primary} />
                  ) : (
                    <ChevronDown size={14} color={COLORS.primary} />
                  )}
                  <Text style={styles.readMoreText}>
                    {overviewExpanded ? "Show less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </SlideUp>

          {/* Glass info card */}
          <SlideUp delay={140}>
            <GlassInfoCard movie={movie} />
          </SlideUp>

          {/* Watch Providers */}
          <SlideUp delay={160}>
            <WatchProviders providers={watchProviders || null} />
          </SlideUp>

          {/* Cast */}
          <SlideUp delay={180}>
            <CastList cast={credits?.cast || []} />
          </SlideUp>

          {/* Director */}
          {credits?.crew && (
            <SlideUp delay={200}>
              <DirectorInfo crew={credits.crew} />
            </SlideUp>
          )}

          {/* Movie Trivia / Quiz Section */}
          <SlideUp delay={210}>
            <View style={styles.triviaSection}>
              <View style={styles.triviaHeader}>
                <Sparkles size={18} color={COLORS.primary} />
                <Text style={styles.triviaTitle}>Did You Know?</Text>
              </View>
              <View style={styles.triviaContent}>
                <Text style={styles.triviaText}>
                  {movie.budget && movie.budget > 0
                    ? `This film had a staggering budget of $${(movie.budget / 1000000).toFixed(1)}M.`
                    : "This production kept its budget details under wraps for a boutique feel."}
                </Text>
                <Text style={styles.triviaText}>
                  {movie.status === "Released" && movie.revenue
                    ? `Since its release, it has earned over $${(movie.revenue / 1000000).toFixed(1)}M at the box office.`
                    : "Early projections suggest this will be a massive hit upon release."}
                </Text>
              </View>
            </View>
          </SlideUp>

          {/* Movie Quiz Section */}
          <SlideUp delay={220}>
            <MovieQuiz
              movieTitle={movie.title || ""}
              cast={credits?.cast || []}
            />
          </SlideUp>

          {/* Similar movies */}
          <SlideUp delay={235}>
            <SimilarMovies
              movies={similarMovies || []}
              isLoading={isSimilarLoading}
            />
          </SlideUp>

          {/* Download info */}
          <SlideUp delay={240}>
            <DownloadInfo
              language={movie.original_language}
              title={movie.title || ""}
            />
          </SlideUp>
        </View>
      </AnimatedScrollView>

      {/* Trailer Player Modal */}
      <TrailerPlayer
        trailerKey={trailerKey}
        visible={isPlayerVisible}
        onClose={closeTrailer}
        movieTitle={movie.title}
      />

      {/* Quick Info Bottom Sheet */}
      <QuickInfoSheet
        movie={movie}
        visible={quickInfoVisible}
        onClose={() => setQuickInfoVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    backgroundColor: COLORS.background,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.lg,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reminderBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  infoBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  voteRow: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  watchActions: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  watchBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  watchBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  trailerBtnSmall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trailerBtnSmallText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  overviewSection: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  overviewTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  overview: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  readMoreText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  triviaSection: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + "15",
    marginBottom: SPACING.xl,
  },
  triviaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  triviaTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  triviaContent: {
    gap: 10,
  },
  triviaText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
  },
});
