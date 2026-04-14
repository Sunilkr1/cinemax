import React, { useEffect } from "react";
import { Dimensions, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

export const SlideUp = ({
  children,
  delay = 0,
  from = 60,
  style,
  useSpring: spring = true,
}: SlideUpProps) => {
  const translateY = useSharedValue(from);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (spring) {
      translateY.value = withDelay(
        delay,
        withSpring(0, { damping: 18, stiffness: 200 }),
      );
    } else {
      translateY.value = withDelay(
        delay,
        withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }),
      );
    }
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

// ─── Full screen slide from bottom (modals) ───────────────────
export const SlideUpFull = ({
  children,
  visible,
  style,
}: {
  children: React.ReactNode;
  visible: boolean;
  style?: ViewStyle;
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : SCREEN_HEIGHT, {
      damping: 20,
      stiffness: 200,
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};
