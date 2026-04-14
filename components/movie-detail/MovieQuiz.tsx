import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MovieQuizProps {
  movieTitle: string;
  cast: any[];
}

export const MovieQuiz = ({ movieTitle, cast }: MovieQuizProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!cast || cast.length < 3) return null;

  // Simple Logic: One real actor, two fake names (or other actors)
  const realActor = cast[0].name;
  const options = [
    realActor,
    "Robert Downey Jr.", // Common name as fake
    "Leonardo DiCaprio", // Common name as fake
  ].sort(() => Math.random() - 0.5);

  const correctAnswerIndex = options.indexOf(realActor);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setIsCorrect(index === correctAnswerIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HelpCircle size={18} color={COLORS.primary} />
        <Text style={styles.title}>Quick Movie Quiz</Text>
      </View>

      <Text style={styles.question}>
        Which of these actors stars in *${movieTitle}*?
      </Text>

      <View style={styles.optionsGrid}>
        {options.map((option, index) => {
          const isThisSelected = selectedOption === index;
          const isThisCorrect = index === correctAnswerIndex;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionBtn,
                selectedOption !== null && isThisCorrect && styles.correctBtn,
                selectedOption !== null &&
                  isThisSelected &&
                  !isThisCorrect &&
                  styles.wrongBtn,
              ]}
              onPress={() => handleSelect(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption !== null && isThisCorrect && { color: "#fff" },
                ]}
              >
                {option}
              </Text>
              {selectedOption !== null && isThisCorrect && (
                <CheckCircle2 size={14} color="#fff" />
              )}
              {selectedOption !== null && isThisSelected && !isThisCorrect && (
                <XCircle size={14} color="#fff" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedOption !== null && (
        <Text
          style={[
            styles.feedback,
            isCorrect ? styles.correctText : styles.wrongText,
          ]}
        >
          {isCorrect
            ? "Correct! You know your movies! 🌟"
            : "Oops! Try another movie next time. 🍿"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  question: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  optionsGrid: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceLight,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  correctBtn: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  wrongBtn: {
    backgroundColor: "#ef4444",
    borderColor: "#dc2626",
  },
  optionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  feedback: {
    marginTop: 15,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  correctText: { color: "#10b981" },
  wrongText: { color: "#ef4444" },
});
