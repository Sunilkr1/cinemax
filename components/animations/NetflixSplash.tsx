import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export const NetflixSplash = ({ onFinish }: { onFinish: () => void }) => {
  const shimmerPos = useRef(new Animated.Value(-width)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    // 1. Initial Fade In
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. The Spotlight Sweep
    Animated.timing(shimmerPos, {
      toValue: width,
      duration: 1800,
      delay: 500,
      useNativeDriver: true,
    }).start(() => {
      // 3. Smooth Out
      setTimeout(() => {
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => onFinish());
      }, 800);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Cinematic Aura */}
      <View style={styles.aura} />

      <Animated.View
        style={[
          styles.content,
          { opacity: contentOpacity, transform: [{ scale }] },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Text style={[styles.text, styles.baseText]}>
            CINE <Text style={{ color: "#444" }}>MAX</Text>
          </Text>

          {/* The Shimmer/Spotlight Over-layer */}
          <Animated.View
            style={[
              styles.shimmerContainer,
              {
                width: width * 0.4, // Width of the light beam
                transform: [{ translateX: shimmerPos }],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.text,
                styles.shimmerText,
                {
                  width: width,
                  transform: [
                    {
                      translateX: shimmerPos.interpolate({
                        inputRange: [-width, width],
                        outputRange: [width, -width],
                      }),
                    },
                  ],
                },
              ]}
            >
              CINE <Text style={{ color: "#E50914" }}>MAX</Text>
            </Animated.Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dot} />
          <Text style={styles.tagline}>BY SUNIL KUMAR</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050505",
    zIndex: 99999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  aura: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    backgroundColor: "rgba(229, 9, 20, 0.03)",
    borderRadius: width,
    top: -height * 0.2,
  },
  content: {
    alignItems: "center",
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: width * 0.14,
    fontWeight: "900",
    letterSpacing: -2,
  },
  baseText: {
    color: "#111", // Nearly invisible base
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  shimmerLight: {
    position: "absolute",
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ skewX: "-20deg" }],
    left: -30,
    zIndex: 2,
  },
  shimmerText: {
    color: "#FFFFFF",
    zIndex: 1,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E50914",
  },
  tagline: {
    color: "#333",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 8,
    textTransform: "uppercase",
  },
});
