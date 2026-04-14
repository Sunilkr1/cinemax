import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { Smartphone } from "lucide-react-native";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface SystemThemeProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
}

export const SystemTheme = ({ enabled, onToggle }: SystemThemeProps) => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconBox}>
        <Smartphone size={18} color={COLORS.success} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Follow System Theme
        </Text>
        <Text style={[styles.desc, { color: colors.textMuted }]}>
          Automatically switches dark/light mode
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.surfaceLight, true: COLORS.primary }}
        thumbColor="#fff"
        ios_backgroundColor={colors.surfaceLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.success + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
  },
});
