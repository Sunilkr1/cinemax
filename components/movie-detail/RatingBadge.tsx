import { RADIUS } from "@/constants/theme";
import {
  getRatingBg,
  getRatingColor,
  getRatingLabel,
} from "@/utils/getRatingColor";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const RatingBadge = ({
  rating,
  size = "md",
  showLabel = false,
}: RatingBadgeProps) => {
  const color = getRatingColor(rating);
  const bg = getRatingBg(rating);
  const label = getRatingLabel(rating);

  const sizeMap = {
    sm: { iconSize: 11, fontSize: 12, pad: [4, 8] },
    md: { iconSize: 13, fontSize: 14, pad: [6, 10] },
    lg: { iconSize: 16, fontSize: 18, pad: [8, 14] },
  };
  const s = sizeMap[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingVertical: s.pad[0],
          paddingHorizontal: s.pad[1],
          borderColor: color + "40",
        },
      ]}
    >
      <Star size={s.iconSize} color={color} fill={color} />
      <Text style={[styles.value, { fontSize: s.fontSize, color }]}>
        {rating.toFixed(1)}
      </Text>
      {showLabel && <Text style={[styles.label, { color }]}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  value: {
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
});
