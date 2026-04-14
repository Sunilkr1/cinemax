import { GENRE_LIST } from "@/constants/genres";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Film } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface GenreFilterChipsProps {
  selectedGenre: number | null;
  onSelect: (id: number | null) => void;
}

export const GenreFilterChips = ({
  selectedGenre,
  onSelect,
}: GenreFilterChipsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {/* All chip */}
      <TouchableOpacity
        style={[styles.chip, selectedGenre === null && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <Film
          size={13}
          color={selectedGenre === null ? "#fff" : COLORS.textSecondary}
        />
        <Text
          style={[
            styles.chipText,
            selectedGenre === null && styles.chipTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Genre chips */}
      {GENRE_LIST.map((genre) => {
        const isSelected = selectedGenre === genre.id;
        return (
          <TouchableOpacity
            key={genre.id}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => onSelect(isSelected ? null : genre.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{genre.emoji}</Text>
            <Text
              style={[styles.chipText, isSelected && styles.chipTextActive]}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  emoji: { fontSize: 13 },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: "#fff",
  },
});
