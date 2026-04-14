import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { MovieDetail } from "@/types/movie.types";
import { getYear } from "@/utils/formatDate";
import { formatRuntime } from "@/utils/formatRuntime";
import { getRatingColor } from "@/utils/getRatingColor";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Clock, Film, Globe, Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GlassInfoCardProps {
  movie: MovieDetail;
}

export const GlassInfoCard = ({ movie }: GlassInfoCardProps) => {
  const ratingColor = getRatingColor(movie.vote_average);

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[COLORS.glass, "transparent"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Row of stats */}
      <View style={styles.statsRow}>
        {/* Rating */}
        <View style={styles.statItem}>
          <View
            style={[styles.iconBox, { backgroundColor: ratingColor + "20" }]}
          >
            <Star size={14} color={ratingColor} fill={ratingColor} />
          </View>
          <Text style={[styles.statValue, { color: ratingColor }]}>
            {movie.vote_average.toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>

        <View style={styles.divider} />

        {/* Runtime */}
        <View style={styles.statItem}>
          <View
            style={[styles.iconBox, { backgroundColor: COLORS.info + "20" }]}
          >
            <Clock size={14} color={COLORS.info} />
          </View>
          <Text style={styles.statValue}>{formatRuntime(movie.runtime)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        <View style={styles.divider} />

        {/* Year */}
        <View style={styles.statItem}>
          <View
            style={[styles.iconBox, { backgroundColor: COLORS.purple + "20" }]}
          >
            <Calendar size={14} color={COLORS.purple} />
          </View>
          <Text style={styles.statValue}>
            {getYear(movie.release_date || movie.first_air_date || "")}
          </Text>
          <Text style={styles.statLabel}>Year</Text>
        </View>

        <View style={styles.divider} />

        {/* Language */}
        <View style={styles.statItem}>
          <View
            style={[styles.iconBox, { backgroundColor: COLORS.success + "20" }]}
          >
            <Globe size={14} color={COLORS.success} />
          </View>
          <Text style={styles.statValue}>
            {movie.original_language.toUpperCase()}
          </Text>
          <Text style={styles.statLabel}>Language</Text>
        </View>
      </View>

      {/* Genres */}
      {movie.genres.length > 0 && (
        <View style={styles.genreRow}>
          <Film size={12} color={COLORS.textMuted} />
          <Text style={styles.genreText}>
            {movie.genres.map((g) => g.name).join(" · ")}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.base,
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 44,
    backgroundColor: COLORS.border,
  },
  genreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  genreText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
});
