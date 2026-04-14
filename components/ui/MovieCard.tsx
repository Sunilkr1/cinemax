import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Movie } from "@/types/movie.types";
import { getYear } from "@/utils/formatDate";
import { getPosterUrl } from "@/utils/getImageUrl";
import { getRatingColor } from "@/utils/getRatingColor";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, Plus, Star } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type MovieCardVariant = "portrait" | "wide" | "top10" | "compact";

interface MovieCardProps {
  movie: Movie;
  variant?: MovieCardVariant;
  rank?: number;
  onPress?: (movie: Movie) => void;
  showWatchlist?: boolean;
  index?: number;
}

// ─── Dimensions per variant ───────────────────────────────────
const VARIANT_DIMS = {
  portrait: { width: 130, height: 195 },
  wide: { width: 220, height: 130 },
  top10: { width: 150, height: 220 },
  compact: { width: 100, height: 150 },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MovieCard = React.memo(function MovieCard({
  movie,
  variant = "portrait",
  rank,
  onPress,
  showWatchlist = true,
  index = 0,
}: MovieCardProps) {
  const router = useRouter();
  const { toggle, isAdded } = useWatchlist();
  const scale = useSharedValue(1);
  const inWatchlist = isAdded(movie.id);

  const dims = VARIANT_DIMS[variant];
  const posterUrl = getPosterUrl(movie.poster_path, "large");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(movie);
    } else {
      const type = movie.media_type || (movie.title ? "movie" : "tv");
      router.push({
        pathname: type === "movie" ? "/movie/[id]" : (type === "tv" ? "/tv/[id]" : "/person/[id]" as any),
        params: { id: movie.id }
      });
    }
  }, [movie, onPress, router]);

  const handleWatchlistPress = useCallback(
    (e: any) => {
      e.stopPropagation();
      toggle(movie);
    },
    [movie, toggle],
  );

  // ─── Top 10 variant ─────────────────────────────────────────
  // ─── Top 10 variant ─────────────────────────────────────────
  if (variant === "top10") {
    return (
      <AnimatedTouchable
        style={[animatedStyle, { marginRight: SPACING.sm }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={{ width: dims.width }}>
          <Image
            source={posterUrl ? { uri: posterUrl } : undefined}
            style={{
              width: dims.width,
              height: dims.height,
              borderRadius: RADIUS.md,
            }}
            contentFit="cover"
            transition={300}
          />
          {rank !== undefined && <Text style={styles.rankNumber}>{rank}</Text>}
        </View>
      </AnimatedTouchable>
    );
  }

  // ─── Wide variant ────────────────────────────────────────────
  if (variant === "wide") {
    const backdropUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : posterUrl;

    return (
      <AnimatedTouchable
        style={[
          animatedStyle,
          {
            width: dims.width,
            height: dims.height,
            marginRight: SPACING.sm,
            borderRadius: RADIUS.md,
            overflow: "hidden",
            ...SHADOWS.md,
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Image
          source={backdropUrl ? { uri: backdropUrl } : undefined}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.wideGradient}
        >
          <Text style={styles.wideTitle} numberOfLines={1}>
            {movie.title}
          </Text>
          <View style={styles.wideInfo}>
            <Star size={10} color={COLORS.gold} fill={COLORS.gold} />
            <Text style={styles.wideRating}>
              {movie.vote_average.toFixed(1)}
            </Text>
            <Text style={styles.wideDot}>•</Text>
            <Text style={styles.wideYear}>
              {getYear(movie.release_date || movie.first_air_date || "")}
            </Text>
            {(movie.media_type === "tv" || !movie.title) && (
              <View style={styles.typeBadgeCompact}>
                <Text style={styles.typeBadgeText}>SERIES</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // ─── Portrait + Compact variant (default) ────────────────────
  return (
    <AnimatedTouchable
      style={[
        animatedStyle,
        {
          width: dims.width,
          marginRight: SPACING.sm,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Poster */}
      <View
        style={{
          width: dims.width,
          height: dims.height,
          borderRadius: RADIUS.md,
          overflow: "hidden",
          ...SHADOWS.md,
        }}
      >
        <Image
          source={posterUrl ? { uri: posterUrl } : undefined}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        />

        {/* Rating badge */}
        <View
          style={[
            styles.ratingBadge,
            { backgroundColor: getRatingColor(movie.vote_average) + "22" },
          ]}
        >
          <Star size={9} color={COLORS.gold} fill={COLORS.gold} />
          <Text
            style={[
              styles.ratingText,
              { color: getRatingColor(movie.vote_average) },
            ]}
          >
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>

        {/* Watchlist button */}
        {showWatchlist && (
          <TouchableOpacity
            style={[
              styles.watchlistBtn,
              {
                backgroundColor: inWatchlist
                  ? COLORS.primary
                  : "rgba(0,0,0,0.6)",
              },
            ]}
            onPress={handleWatchlistPress}
          >
            {inWatchlist ? (
              <Check size={11} color="#fff" strokeWidth={2.5} />
            ) : (
              <Plus size={11} color="#fff" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        )}

        {/* Bottom gradient + title */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={styles.portraitGradient}
        >
          <Text style={styles.portraitTitle} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>
          {(movie.media_type === "tv" || !movie.title) && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>SERIES</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </AnimatedTouchable>
  );
});

const styles = StyleSheet.create({
  ratingBadge: {
    position: "absolute",
    top: 7,
    left: 7,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  ratingText: {
    fontSize: 9,
    fontWeight: "700",
  },
  watchlistBtn: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  portraitGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    justifyContent: "flex-end",
    padding: 8,
  },
  portraitTitle: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 14,
  },
  wideGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: "flex-end",
    padding: 10,
  },
  wideTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  wideInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  wideRating: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "600",
  },
  wideDot: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  wideYear: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  rankNumber: {
    position: "absolute",
    bottom: -10,
    left: -6,
    fontSize: 80,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textShadowColor: "#000",
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 10,
    lineHeight: 88,
  },
  typeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  typeBadgeCompact: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    borderRadius: RADIUS.xs,
    marginLeft: 6,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "900",
  },
});
