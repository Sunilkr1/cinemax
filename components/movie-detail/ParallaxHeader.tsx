import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { shareMovie } from "@/lib/share";
import { MovieDetail } from "@/types/movie.types";
import { getBackdropUrl, getPosterUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Share2 } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: W } = Dimensions.get("window");
export const HEADER_HEIGHT = 420;

interface ParallaxHeaderProps {
  movie: MovieDetail;
  scrollY: SharedValue<number>;
}

export const ParallaxHeader = ({ movie, scrollY }: ParallaxHeaderProps) => {
  const router = useRouter();
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "large");
  const posterUrl = getPosterUrl(movie.poster_path, "large");

  // Parallax backdrop
  const backdropStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, HEADER_HEIGHT * 0.4],
      "clamp",
    );
    const scale = interpolate(scrollY.value, [-100, 0], [1.2, 1], "clamp");
    return { transform: [{ translateY }, { scale }] };
  });

  // Nav bar opacity on scroll
  const navStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
      [0, 1],
      "clamp",
    );
    return { opacity };
  });

  return (
    <View style={styles.container}>
      {/* Backdrop with parallax */}
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <Image
          source={backdropUrl ? { uri: backdropUrl } : undefined}
          style={{ width: W, height: HEADER_HEIGHT + 80 }}
          contentFit="cover"
          transition={400}
        />
      </Animated.View>

      {/* Gradient overlays */}
      <LinearGradient
        colors={["rgba(10,10,10,0.2)", "rgba(10,10,10,0.5)", "#0a0a0a"]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(10,10,10,0.7)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
        }}
      />

      {/* Navigation bar */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <Animated.Text style={[styles.navTitle, navStyle]} numberOfLines={1}>
          {movie.title || ""}
        </Animated.Text>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => shareMovie(movie.title || "", movie.id, movie.overview)}
        >
          <Share2 size={18} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Bottom — poster + title info */}
      <View style={styles.bottom}>
        {/* Poster (no sharedTransitionTag — not supported on expo-image) */}
        <View style={styles.posterShadow}>
          <Image
            source={posterUrl ? { uri: posterUrl } : undefined}
            style={styles.poster}
            contentFit="cover"
            transition={300}
          />
        </View>

        {/* Title block */}
        <View style={styles.info}>
          {movie.tagline ? (
            <Text style={styles.tagline} numberOfLines={2}>
              "{movie.tagline}"
            </Text>
          ) : null}
          <Text style={styles.title} numberOfLines={3}>
            {movie.title || ""}
          </Text>
          {movie.original_title !== movie.title && (
            <Text style={styles.originalTitle} numberOfLines={1}>
              {movie.original_title}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: 56,
    paddingBottom: SPACING.sm,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  navTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: SPACING.base,
    gap: SPACING.md,
  },
  posterShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: RADIUS.md,
  },
  info: { flex: 1, gap: 4 },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontStyle: "italic",
    lineHeight: 15,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 27,
    letterSpacing: -0.5,
  },
  originalTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
