import { COLORS } from "@/constants/theme";
import { Heart } from "lucide-react-native";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Toast } from "./Toast";

interface AnimatedHeartProps {
  isActive: boolean;
  onToggle: () => boolean; // returns true if added
  movieTitle?: string;
  size?: number;
  style?: ViewStyle;
  activeColor?: string;
}

export const AnimatedHeart = ({
  isActive,
  onToggle,
  movieTitle,
  size = 24,
  style,
  activeColor = COLORS.primary,
}: AnimatedHeartProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = useCallback(() => {
    // Burst animation
    scale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 300 }),
      withSpring(0.9, { damping: 8 }),
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 12 }),
    );

    if (!isActive) {
      // Wobble on add
      rotation.value = withSequence(
        withTiming(-15, { duration: 80 }),
        withTiming(15, { duration: 80 }),
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      );
    }

    const added = onToggle();

    if (movieTitle) {
      runOnJS(Toast.watchlist)(added, movieTitle);
    }
  }, [isActive, onToggle, movieTitle]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[styles.btn, style]}
    >
      <Animated.View style={animatedStyle}>
        <Heart
          size={size}
          color={isActive ? activeColor : COLORS.textSecondary}
          fill={isActive ? activeColor : "transparent"}
          strokeWidth={isActive ? 2.5 : 1.8}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
