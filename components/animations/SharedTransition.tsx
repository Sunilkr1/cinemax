import React from "react";
import { Platform, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface SharedTransitionProps {
  children: React.ReactNode;
  sharedTransitionTag?: string;
  style?: ViewStyle;
}

// Shared element transition wrapper
// Works with expo-router push transitions
export const SharedTransitionView = ({
  children,
  sharedTransitionTag,
  style,
}: SharedTransitionProps) => {
  // Shared transitions supported only on iOS/Android
  if (Platform.OS === "web" || !sharedTransitionTag) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  return (
    <Animated.View sharedTransitionTag={sharedTransitionTag} style={style}>
      {children}
    </Animated.View>
  );
};

// ─── Movie poster with shared transition ─────────────────────
interface SharedPosterProps {
  movieId: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SharedPoster = ({
  movieId,
  children,
  style,
}: SharedPosterProps) => (
  <SharedTransitionView
    sharedTransitionTag={`movie-poster-${movieId}`}
    style={style}
  >
    {children}
  </SharedTransitionView>
);

// ─── Movie backdrop with shared transition ────────────────────
export const SharedBackdrop = ({
  movieId,
  children,
  style,
}: SharedPosterProps) => (
  <SharedTransitionView
    sharedTransitionTag={`movie-backdrop-${movieId}`}
    style={style}
  >
    {children}
  </SharedTransitionView>
);
