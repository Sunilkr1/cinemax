import { useRouter } from "expo-router";
import { Sparkles, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { MoodInputBox } from "@/components/ai/MoodInputBox";
import { FadeIn, FadeInList } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { MovieCard } from "@/components/ui/MovieCard";
import { SectionSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks + constants
import { MOODS, Mood } from "@/constants/moods";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useMoodMovies } from "@/hooks/useRecommendations";

const { width: W } = Dimensions.get("window");

// ─── Mood card ────────────────────────────────────────────────
const MoodCard = ({
  mood,
  selected,
  onSelect,
}: {
  mood: Mood;
  selected: boolean;
  onSelect: (mood: Mood) => void;
}) => (
  <TouchableOpacity
    style={[
      styles.moodCard,
      {
        borderColor: selected ? mood.color : COLORS.border,
        backgroundColor: selected ? mood.color + "18" : COLORS.surfaceLight,
      },
    ]}
    onPress={() => onSelect(mood)}
    activeOpacity={0.8}
  >
    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
    <Text style={[styles.moodLabel, selected && { color: mood.color }]}>
      {mood.label}
    </Text>
    <Text style={styles.moodDesc} numberOfLines={1}>
      {mood.description}
    </Text>
    {selected && (
      <View style={[styles.selectedDot, { backgroundColor: mood.color }]} />
    )}
  </TouchableOpacity>
);

export default function MoodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { movies, description, isLoading, fetchByMood } = useMoodMovies();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    fetchByMood(mood.label + " " + mood.description);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={movies}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        numColumns={3}
        renderItem={({ item, index }) => (
          <FadeInList index={index}>
            <View style={styles.gridItem}>
              <MovieCard movie={item} variant="compact" />
            </View>
          </FadeInList>
        )}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <FadeIn>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Sparkles size={22} color={COLORS.gold} fill={COLORS.gold} />
                  <Text style={styles.headerTitle}>Mood Picker</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => router.back()}
                >
                  <X size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={50}>
              <Text style={styles.subtitle}>
                Tell us how you're feeling and we'll find the perfect movie
              </Text>
            </FadeIn>

            {/* Mood grid */}
            <FadeIn delay={100}>
              <View style={styles.moodGrid}>
                {MOODS.map((mood) => (
                  <MoodCard
                    key={mood.id}
                    mood={mood}
                    selected={selectedMood?.id === mood.id}
                    onSelect={handleMoodSelect}
                  />
                ))}
              </View>
            </FadeIn>

            {/* AI input */}
            <SlideUp delay={150}>
              <View style={styles.aiSection}>
                <View style={styles.aiHeader}>
                  <Sparkles size={14} color={COLORS.purple} />
                  <Text style={styles.aiTitle}>
                    Or describe your mood in words
                  </Text>
                </View>
                <MoodInputBox />
              </View>
            </SlideUp>

            {/* Results header */}
            {((movies?.length || 0) > 0 || isLoading) && (
              <SlideUp delay={200}>
                <View style={styles.resultsHeader}>
                  {description ? (
                    <Text style={styles.description}>{description}</Text>
                  ) : null}
                  <Text style={styles.resultsTitle}>
                    {selectedMood?.label || "Your"} Movies
                  </Text>
                </View>
              </SlideUp>
            )}

            {/* Loading */}
            {isLoading && <SectionSkeleton variant="portrait" count={5} />}
          </>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  moodCard: {
    width: (W - SPACING.base * 2 - SPACING.sm * 3) / 4,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 4,
    position: "relative",
  },
  moodEmoji: { fontSize: 26 },
  moodLabel: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  moodDesc: {
    color: COLORS.textMuted,
    fontSize: 9,
    textAlign: "center",
  },
  selectedDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiSection: {
    marginBottom: SPACING.md,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  aiTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  resultsHeader: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    gap: 4,
  },
  description: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    fontStyle: "italic",
  },
  resultsTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: SPACING.sm,
    maxWidth: "33.33%",
  },
});
