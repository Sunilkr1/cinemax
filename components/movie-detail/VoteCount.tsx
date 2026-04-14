import { COLORS, RADIUS } from "@/constants/theme";
import { Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface VoteCountProps {
  count: number;
}

const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n ?? 0);
};

export const VoteCount = ({ count }: VoteCountProps) => (
  <View style={styles.container}>
    <Users size={12} color={COLORS.textMuted} />
    <Text style={styles.text}>{formatCount(count)} votes</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
});
