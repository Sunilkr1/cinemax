import { COLORS, RADIUS } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { shareMovie } from "@/lib/share";
import { Share2 } from "lucide-react-native";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ShareButtonProps {
  movieId: number;
  movieTitle: string;
  overview?: string;
  variant?: "icon" | "button";
}

export const ShareButton = ({
  movieId,
  movieTitle,
  overview,
  variant = "button",
}: ShareButtonProps) => {
  const colors = useThemeColors();

  const handleShare = useCallback(() => {
    shareMovie(movieTitle, movieId, overview);
  }, [movieId, movieTitle, overview]);

  if (variant === "icon") {
    return (
      <TouchableOpacity 
        style={[styles.iconBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]} 
        onPress={handleShare}
      >
        <Share2 size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]} 
      onPress={handleShare}
    >
      <Share2 size={15} color={colors.textSecondary} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>Share</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
