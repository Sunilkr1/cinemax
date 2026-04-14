import { COLORS, RADIUS } from "@/constants/theme";
import {
  Award,
  Calendar,
  Clock,
  Film,
  Flame,
  Globe,
  Star,
  Tv,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

export type BadgeVariant =
  | "rating"
  | "runtime"
  | "year"
  | "language"
  | "genre"
  | "trending"
  | "topRated"
  | "nowPlaying"
  | "upcoming"
  | "custom";

interface BadgeConfigItem {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label?: string;
}

interface BadgeProps {
  variant: BadgeVariant;
  value: string | number;
  color?: string;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

// ─── Use a function to get config — avoids "type as value" error ──
const getBadgeConfig = (variant: BadgeVariant): BadgeConfigItem => {
  switch (variant) {
    case "rating":
      return {
        icon: <Star size={10} color={COLORS.gold} fill={COLORS.gold} />,
        color: COLORS.gold,
        bg: "rgba(245,197,24,0.15)",
      };
    case "runtime":
      return {
        icon: <Clock size={10} color={COLORS.textSecondary} />,
        color: COLORS.textSecondary,
        bg: COLORS.surfaceLight,
      };
    case "year":
      return {
        icon: <Calendar size={10} color={COLORS.textSecondary} />,
        color: COLORS.textSecondary,
        bg: COLORS.surfaceLight,
      };
    case "language":
      return {
        icon: <Globe size={10} color={COLORS.blue} />,
        color: COLORS.blue,
        bg: "rgba(59,130,246,0.15)",
      };
    case "genre":
      return {
        icon: <Film size={10} color={COLORS.purple} />,
        color: COLORS.purple,
        bg: "rgba(139,92,246,0.15)",
      };
    case "trending":
      return {
        icon: <Flame size={10} color={COLORS.primary} />,
        color: COLORS.primary,
        bg: "rgba(229,9,20,0.15)",
        label: "Trending",
      };
    case "topRated":
      return {
        icon: <Award size={10} color={COLORS.gold} />,
        color: COLORS.gold,
        bg: "rgba(245,197,24,0.15)",
        label: "Top Rated",
      };
    case "nowPlaying":
      return {
        icon: <Film size={10} color={COLORS.success} />,
        color: COLORS.success,
        bg: "rgba(34,197,94,0.15)",
        label: "Now Playing",
      };
    case "upcoming":
      return {
        icon: <Calendar size={10} color={COLORS.info} />,
        color: COLORS.info,
        bg: "rgba(59,130,246,0.15)",
        label: "Upcoming",
      };
    case "custom":
    default:
      return {
        icon: <Tv size={10} color={COLORS.textSecondary} />,
        color: COLORS.textSecondary,
        bg: COLORS.surfaceLight,
      };
  }
};

const SIZE_MAP = {
  sm: { px: 6, py: 3, fontSize: 9 },
  md: { px: 8, py: 4, fontSize: 11 },
  lg: { px: 10, py: 6, fontSize: 13 },
};

export const Badge = ({
  variant,
  value,
  color,
  size = "md",
  style,
}: BadgeProps) => {
  const config = getBadgeConfig(variant);
  const sz = SIZE_MAP[size];
  const displayColor = color || config.color;
  const displayValue = config.label || String(value ?? "");

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingHorizontal: sz.px,
          paddingVertical: sz.py,
          borderColor: displayColor + "30",
        },
        style,
      ]}
    >
      {config.icon}
      <Text
        style={[styles.text, { fontSize: sz.fontSize, color: displayColor }]}
      >
        {displayValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
