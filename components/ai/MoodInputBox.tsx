import { MovieCard } from "@/components/ui/MovieCard";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { useMoodMovies } from "@/hooks/useRecommendations";
import { Send, Sparkles, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const QUICK_MOODS = [
  "Something exciting 🔥",
  "Make me laugh 😂",
  "Cry it out 😢",
  "Mind-bending 🤯",
  "Romantic ❤️",
  "Family night 👨‍👩‍👧",
];

export const MoodInputBox = () => {
  const [text, setText] = useState("");
  const { movies, description, isLoading, fetchByMood } = useMoodMovies();

  const handleSubmit = () => {
    if (!text.trim()) return;
    fetchByMood(text.trim());
    setText("");
  };

  const handleQuickMood = (mood: string) => {
    fetchByMood(mood);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Sparkles size={16} color={COLORS.gold} fill={COLORS.gold} />
        <Text style={styles.title}>Mood Search</Text>
      </View>
      <Text style={styles.subtitle}>
        Tell us how you feel — we'll find the perfect movie
      </Text>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="e.g. something thrilling and dark..."
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          multiline={false}
          selectionColor={COLORS.primary}
        />
        {text.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setText("")}>
            <X size={13} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!text.trim() || isLoading) && styles.sendBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Mood Chips */}
      <View style={styles.quickRow}>
        {QUICK_MOODS.map((mood, i) => (
          <TouchableOpacity
            key={i}
            style={styles.quickChip}
            onPress={() => handleQuickMood(mood)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading state */}
      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={COLORS.primary} size="small" />
          <Text style={styles.loadingText}>
            Finding movies for your mood...
          </Text>
        </View>
      )}

      {/* Result description */}
      {!!description && !isLoading && (
        <View style={styles.descriptionBox}>
          <Sparkles size={13} color={COLORS.primary} />
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}

      {/* Results */}
      {(movies?.length || 0) > 0 && !isLoading && (
        <FlatList
          horizontal
          data={movies}
          // ✅ index prop removed — MovieCard doesn't accept it
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => (
            <MovieCard movie={item} variant="portrait" />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearBtn: {
    position: "absolute",
    right: 60,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceMid,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.primary,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickChip: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: SPACING.sm,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  descriptionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: COLORS.primary + "10",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + "25",
  },
  descriptionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  list: {
    paddingTop: SPACING.sm,
  },
});
