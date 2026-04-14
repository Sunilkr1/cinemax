import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { WifiOff } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface OfflineBadgeProps {
  isOffline: boolean;
}

export const OfflineBadge = ({ isOffline }: OfflineBadgeProps) => {
  if (!isOffline) return null;

  return (
    <View style={styles.badge}>
      <WifiOff size={13} color={COLORS.warning} />
      <Text style={styles.text}>Offline — Showing cached content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.warning + "15",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning + "30",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: "600",
  },
});
