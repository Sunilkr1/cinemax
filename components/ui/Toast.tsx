import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
import {
  AlertCircle,
  CheckCircle,
  Heart,
  Info,
  Star,
  X,
  XCircle,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "watchlist"
  | "rating";

interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState extends ToastConfig {
  visible: boolean;
}

interface ToastConfigItem {
  icon: React.ReactNode;
  color: string;
  bg: string;
}

// ─── Global toast controller ──────────────────────────────────
type ToastListener = (config: ToastState) => void;
let listener: ToastListener | null = null;

export const Toast = {
  show: (config: ToastConfig) => {
    listener?.({ ...config, visible: true });
  },
  success: (title: string, message?: string) =>
    Toast.show({ type: "success", title, message }),
  error: (title: string, message?: string) =>
    Toast.show({ type: "error", title, message }),
  warning: (title: string, message?: string) =>
    Toast.show({ type: "warning", title, message }),
  info: (title: string, message?: string) =>
    Toast.show({ type: "info", title, message }),
  watchlist: (added: boolean, title: string) =>
    Toast.show({
      type: "watchlist",
      title: added ? "Added to Watchlist" : "Removed from Watchlist",
      message: title,
    }),
};

// ─── Use function to get config — avoids "type as value" error ───
const getToastConfig = (type: ToastType): ToastConfigItem => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle size={20} color={COLORS.success} />,
        color: COLORS.success,
        bg: "rgba(34,197,94,0.12)",
      };
    case "error":
      return {
        icon: <XCircle size={20} color={COLORS.error} />,
        color: COLORS.error,
        bg: "rgba(239,68,68,0.12)",
      };
    case "warning":
      return {
        icon: <AlertCircle size={20} color={COLORS.warning} />,
        color: COLORS.warning,
        bg: "rgba(234,179,8,0.12)",
      };
    case "info":
      return {
        icon: <Info size={20} color={COLORS.info} />,
        color: COLORS.info,
        bg: "rgba(59,130,246,0.12)",
      };
    case "watchlist":
      return {
        icon: <Heart size={20} color={COLORS.primary} fill={COLORS.primary} />,
        color: COLORS.primary,
        bg: "rgba(229,9,20,0.12)",
      };
    case "rating":
      return {
        icon: <Star size={20} color={COLORS.gold} fill={COLORS.gold} />,
        color: COLORS.gold,
        bg: "rgba(245,197,24,0.12)",
      };
    default:
      return {
        icon: <Info size={20} color={COLORS.info} />,
        color: COLORS.info,
        bg: "rgba(59,130,246,0.12)",
      };
  }
};

// ─── Toast Provider ───────────────────────────────────────────
export const ToastProvider = () => {
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const timerRef = useRef<any>(null);

  const hide = useCallback(() => {
    translateY.value = withTiming(-120, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (done) => {
      if (done) runOnJS(setToast)(null);
    });
  }, []);

  useEffect(() => {
    listener = (config) => {
      setToast(config);
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, config.duration || 3000);
    };

    return () => {
      listener = null;
      clearTimeout(timerRef.current);
    };
  }, [hide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const config = getToastConfig(toast.type);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={60} tint="dark" style={styles.blur}>
        <View
          style={[
            styles.inner,
            {
              backgroundColor: config.bg,
              borderColor: config.color + "30",
            },
          ]}
        >
          <View style={styles.iconBox}>{config.icon}</View>
          <View style={styles.textBox}>
            <Text style={[styles.title, { color: config.color }]}>
              {toast.title}
            </Text>
            {toast.message && (
              <Text style={styles.message} numberOfLines={1}>
                {toast.message}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={hide} style={styles.closeBtn}>
            <X size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: SPACING.base,
    right: SPACING.base,
    zIndex: 9999,
    ...SHADOWS.lg,
  },
  blur: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  textBox: { flex: 1, gap: 2 },
  title: { fontSize: 13, fontWeight: "700" },
  message: { fontSize: 12, color: COLORS.textSecondary },
  closeBtn: { padding: 4 },
});
