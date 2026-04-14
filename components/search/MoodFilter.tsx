import { MOODS } from "@/constants/moods";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Smile } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MoodFilterProps {
  selectedMood: string | null;
  onSelect: (moodId: string | null) => void;
}

export const MoodFilter = ({ selectedMood, onSelect }: MoodFilterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Smile size={16} color={COLORS.gold} />
        <Text style={styles.headerText}>What's your mood?</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.card,
                isSelected && {
                  backgroundColor: mood.color + "20",
                  borderColor: mood.color + "60",
                },
              ]}
              onPress={() => onSelect(isSelected ? null : mood.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={[styles.label, isSelected && { color: mood.color }]}>
                {mood.label}
              </Text>
              {isSelected && (
                <View
                  style={[styles.activeDot, { backgroundColor: mood.color }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  list: {
    paddingHorizontal: SPACING.base,
    gap: 10,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    width: 78,
    height: 78,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 4,
    position: "relative",
  },
  emoji: { fontSize: 24 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  activeDot: {
    position: "absolute",
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
