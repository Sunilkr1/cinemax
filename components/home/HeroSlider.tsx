import { FadeIn } from "@/components/animations/FadeIn";
import { GENRES } from "@/constants/genres";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Movie } from "@/types/movie.types";
import { getYear } from "@/utils/formatDate";
import { getBackdropUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, Clock, Play, Plus, Star } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: W, height: H } = Dimensions.get("window");
const HERO_HEIGHT = H * 0.58;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Movie>);

interface HeroSliderProps {
  movies: Movie[];
}

interface HeroSlideProps {
  movie: Movie;
  index: number;
  scrollX: SharedValue<number>;
}

// ─── Single slide ─────────────────────────────────────────────
const HeroSlide = React.memo(({ movie, index, scrollX }: HeroSlideProps) => {
  const router = useRouter();
  const { toggle, isAdded } = useWatchlist();
  const inWatchlist = isAdded(movie.id);
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "large");

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * W, index * W, (index + 1) * W];
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92]);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);
    return { transform: [{ scale }], opacity };
  });

  const genreNames = movie.genre_ids
    ?.slice(0, 2)
    .map((id) => GENRES[id])
    .filter(Boolean)
    .join(" • ");

  return (
    <Animated.View style={[{ width: W, height: HERO_HEIGHT }, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          const type = movie.media_type || (movie.title ? "movie" : "tv");
          router.push({
            pathname: type === "movie" ? "/movie/[id]" : "/tv/[id]",
            params: { id: movie.id },
          });
        }}
        style={{ flex: 1 }}
      >
        <Image
          source={backdropUrl ? { uri: backdropUrl } : undefined}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={["rgba(10,10,10,0.15)", "rgba(10,10,10,0.3)", "#0a0a0a"]}
          style={[StyleSheet.absoluteFill, { justifyContent: "flex-end" }]}
        />
        <LinearGradient
          colors={["rgba(10,10,10,0.6)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
          }}
        />

        <View style={styles.heroContent}>
          {genreNames ? (
            <View style={styles.genreRow}>
              <View style={styles.genreChip}>
                <Text style={styles.genreText}>{genreNames}</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.heroTitle} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
              <Text style={styles.metaGold}>
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>
              {getYear(movie.release_date || movie.first_air_date || "")}
            </Text>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Clock size={11} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {movie.original_language?.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.heroOverview} numberOfLines={2}>
            {movie.overview || ""}
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => {
                const type = movie.media_type || (movie.title ? "movie" : "tv");
                router.push({
                  pathname: type === "movie" ? "/movie/[id]" : "/tv/[id]",
                  params: { id: movie.id },
                });
              }}
              activeOpacity={0.85}
            >
              <Play size={16} color="#fff" fill="#fff" />
              <Text style={styles.playBtnText}>Watch Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.watchlistBtn,
                inWatchlist && { borderColor: COLORS.primary + "60" },
              ]}
              onPress={() => toggle(movie)}
              activeOpacity={0.85}
            >
              {inWatchlist ? (
                <Check size={16} color={COLORS.primary} strokeWidth={2.5} />
              ) : (
                <Plus size={16} color={COLORS.textPrimary} />
              )}
              <Text
                style={[
                  styles.watchlistBtnText,
                  inWatchlist && { color: COLORS.primary },
                ]}
              >
                {inWatchlist ? "Saved" : "Watchlist"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── Dot indicator ────────────────────────────────────────────
const DotIndicator = ({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) => (
  <View style={styles.dots}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          {
            width: i === activeIndex ? 20 : 6,
            backgroundColor:
              i === activeIndex ? COLORS.primary : COLORS.textMuted,
          },
        ]}
      />
    ))}
  </View>
);

// ─── Main HeroSlider ──────────────────────────────────────────
export const HeroSlider = ({ movies }: HeroSliderProps) => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems[0]) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  if (!movies?.length) return null;

  return (
    <FadeIn duration={600}>
      <View style={{ height: HERO_HEIGHT }}>
        <AnimatedFlatList
          data={movies.slice(0, 6)}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item, index }) => (
            <HeroSlide movie={item} index={index} scrollX={scrollX} />
          )}
        />
        <DotIndicator
          count={Math.min(movies?.length || 0, 6)}
          activeIndex={activeIndex}
        />
      </View>
    </FadeIn>
  );
};

const styles = StyleSheet.create({
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  genreRow: { marginBottom: 8 },
  genreChip: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  genreText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaGold: { color: COLORS.gold, fontSize: 12, fontWeight: "700" },
  metaText: { color: COLORS.textSecondary, fontSize: 12 },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  heroOverview: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  btnRow: { flexDirection: "row", gap: 10 },
  playBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    ...SHADOWS.primary,
  },
  playBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  watchlistBtn: {
    paddingHorizontal: 18,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  watchlistBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  dots: {
    position: "absolute",
    bottom: SPACING.xl + 80,
    right: SPACING.base,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
