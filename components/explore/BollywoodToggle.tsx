import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Film, Globe } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BollywoodToggleProps {
  isBollywood: boolean;

  onToggle: (val: boolean) => void;
}

export const BollywoodToggle = ({
  isBollywood,
  onToggle,
}: BollywoodToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, !isBollywood && styles.tabActive]}
        onPress={() => onToggle(false)}
        activeOpacity={0.8}
      >
        <Globe size={15} color={!isBollywood ? "#fff" : COLORS.textSecondary} />
        <Text style={[styles.tabText, !isBollywood && styles.tabTextActive]}>
          Hollywood
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, isBollywood && styles.tabActiveBollywood]}
        onPress={() => onToggle(true)}
        activeOpacity={0.8}
      >
        <Film size={15} color={isBollywood ? "#fff" : COLORS.textSecondary} />
        <Text style={[styles.tabText, isBollywood && styles.tabTextActive]}>
          Bollywood 🇮🇳
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    padding: 4,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabActiveBollywood: {
    backgroundColor: COLORS.warning,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: "#fff",
  },
});
