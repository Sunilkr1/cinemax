import { COLORS, RADIUS } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { ThemeMode } from "@/store/theme.store";
import { Moon, Smartphone, Sun } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ThemeToggleProps {
  currentMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

export const ThemeToggle = ({ currentMode, onSelect }: ThemeToggleProps) => {
  const colors = useThemeColors();

  const OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] =
    [
      {
        value: "dark",
        label: "Dark",
        icon: <Moon size={16} color={COLORS.info} />,
      },
      {
        value: "light",
        label: "Light",
        icon: <Sun size={16} color={COLORS.gold} />,
      },
      {
        value: "system",
        label: "System",
        icon: <Smartphone size={16} color={COLORS.success} />,
      },
    ];

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
      ]}
    >
      {OPTIONS.map((opt) => {
        const isActive = currentMode === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.tab,
              isActive && {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.8}
          >
            {opt.icon}
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.textPrimary : colors.textMuted },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderRadius: RADIUS.lg,
    padding: 4,
    borderWidth: 1,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
