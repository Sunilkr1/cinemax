import { COLORS, SHADOWS } from "@/constants/theme";
import { Mic, MicOff } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface VoiceSearchProps {
  onResult: (text: string) => void;
  size?: number;
}

export const VoiceSearch = ({ onResult, size = 44 }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const scale = useSharedValue(1);

  const startPulse = useCallback(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, []);

  const stopPulse = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  const handlePress = useCallback(() => {
    if (isListening) {
      setIsListening(false);
      stopPulse();
      return;
    }

    Alert.alert(
      "Voice Search",
      "The Voice Search module is currently unavailable in this build. Please type your query instead.",
      [{ text: "OK" }],
    );
  }, [isListening, stopPulse]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.btn,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isListening ? COLORS.primary : COLORS.surfaceLight,
          },
          isListening && animStyle,
        ]}
      >
        {isListening ? (
          <MicOff size={size * 0.4} color="#fff" />
        ) : (
          <Mic size={size * 0.4} color={COLORS.primary} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
});
