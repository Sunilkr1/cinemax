import { RADIUS } from "@/constants/theme";
import { LanguageCode, LANGUAGES } from "@/constants/tmdb";
import { useThemeColors } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LanguageToggleProps {
  currentCode: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}

export const LanguageToggle = ({
  currentCode,
  onSelect,
}: LanguageToggleProps) => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
      ]}
    >
      {(
        Object.entries(LANGUAGES) as [
          LanguageCode,
          (typeof LANGUAGES)[LanguageCode],
        ][]
      ).map(([code, lang]) => {
        const isActive = currentCode === code;
        return (
          <TouchableOpacity
            key={code}
            style={[
              styles.tab,
              isActive && {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            onPress={() => onSelect(code)}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.textPrimary : colors.textMuted },
              ]}
            >
              {lang.label}
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
    paddingVertical: 11,
    borderRadius: RADIUS.md,
  },
  flag: { fontSize: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
