import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Base skeleton box ────────────────────────────────────────
interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

export const SkeletonBox = ({
  width,
  height,
  borderRadius = RADIUS.md,
  style,
}: SkeletonBoxProps) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmer.value,
          [0, 1],
          [-SCREEN_WIDTH, SCREEN_WIDTH],
        ),
      },
    ],
  }));

  return (
    <View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: COLORS.surfaceLight,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.06)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// ─── Movie card skeleton ──────────────────────────────────────
export const MovieCardSkeleton = ({
  variant = "portrait",
}: {
  variant?: "portrait" | "wide" | "top10";
}) => {
  const dims =
    variant === "wide"
      ? { width: 220, height: 130 }
      : variant === "top10"
        ? { width: 150, height: 220 }
        : { width: 130, height: 195 };

  return (
    <View style={{ marginRight: SPACING.sm }}>
      <SkeletonBox width={dims.width} height={dims.height} />
      {variant === "portrait" && (
        <View style={{ marginTop: 8, gap: 4 }}>
          <SkeletonBox width={dims.width} height={10} borderRadius={4} />
          <SkeletonBox width={dims.width * 0.6} height={10} borderRadius={4} />
        </View>
      )}
    </View>
  );
};

// ─── Hero skeleton ────────────────────────────────────────────
export const HeroSkeleton = () => (
  <SkeletonBox width={SCREEN_WIDTH} height={480} borderRadius={0} />
);

// ─── Section skeleton (horizontal row) ───────────────────────
export const SectionSkeleton = ({
  variant = "portrait",
  count = 5,
}: {
  variant?: "portrait" | "wide" | "top10";
  count?: number;
}) => (
  <View>
    {/* Section header skeleton */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING.base,
        marginBottom: SPACING.md,
      }}
    >
      <SkeletonBox width={140} height={18} borderRadius={6} />
      <SkeletonBox width={50} height={14} borderRadius={6} />
    </View>

    {/* Cards row */}
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: SPACING.base,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} variant={variant} />
      ))}
    </View>
  </View>
);

// ─── Movie detail skeleton ────────────────────────────────────
export const MovieDetailSkeleton = () => (
  <View style={{ flex: 1, backgroundColor: COLORS.background }}>
    {/* Backdrop */}
    <SkeletonBox width={SCREEN_WIDTH} height={400} borderRadius={0} />
    <View style={{ padding: SPACING.base, gap: SPACING.md }}>
      {/* Title */}
      <SkeletonBox width={SCREEN_WIDTH * 0.7} height={28} borderRadius={8} />
      {/* Tagline */}
      <SkeletonBox width={SCREEN_WIDTH * 0.5} height={16} borderRadius={6} />
      {/* Info row */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonBox width={60} height={28} borderRadius={RADIUS.full} />
        <SkeletonBox width={60} height={28} borderRadius={RADIUS.full} />
        <SkeletonBox width={80} height={28} borderRadius={RADIUS.full} />
      </View>
      {/* Overview */}
      <View style={{ gap: 8 }}>
        <SkeletonBox width="100%" height={14} borderRadius={4} />
        <SkeletonBox width="100%" height={14} borderRadius={4} />
        <SkeletonBox width="80%" height={14} borderRadius={4} />
      </View>
      {/* Cast row */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ alignItems: "center", gap: 6 }}>
            <SkeletonBox width={70} height={70} borderRadius={RADIUS.full} />
            <SkeletonBox width={60} height={10} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

// ─── Cast card skeleton ───────────────────────────────────────
export const CastCardSkeleton = () => (
  <View
    style={{
      alignItems: "center",
      marginRight: SPACING.md,
      gap: 8,
    }}
  >
    <SkeletonBox width={80} height={80} borderRadius={RADIUS.full} />
    <SkeletonBox width={70} height={10} borderRadius={4} />
    <SkeletonBox width={55} height={9} borderRadius={4} />
  </View>
);

// ─── Search result skeleton ───────────────────────────────────
export const SearchResultSkeleton = () => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SPACING.base,
      paddingVertical: SPACING.sm,
      gap: SPACING.md,
    }}
  >
    <SkeletonBox width={60} height={90} borderRadius={RADIUS.sm} />
    <View style={{ flex: 1, gap: 8 }}>
      <SkeletonBox width="70%" height={14} borderRadius={4} />
      <SkeletonBox width="40%" height={12} borderRadius={4} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonBox width={50} height={22} borderRadius={RADIUS.full} />
        <SkeletonBox width={60} height={22} borderRadius={RADIUS.full} />
      </View>
    </View>
  </View>
);
