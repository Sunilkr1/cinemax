import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { BarChart2, Star, TrendingUp } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CriticsMeterProps {
  tmdbRating: number;
  imdbRating: string | null;
  rtRating: string | null;
  isLoading: boolean;
}

export const CriticsMeter = ({
  tmdbRating,
  imdbRating,
  rtRating,
  isLoading,
}: CriticsMeterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* TMDB */}
        <View style={styles.scoreItem}>
          <View style={[styles.iconCircle, { backgroundColor: "#01d27720" }]}>
            <Star size={14} color="#01d277" fill="#01d277" />
          </View>
          <View>
            <Text style={styles.score}>{tmdbRating.toFixed(1)}</Text>
            <Text style={styles.label}>TMDB</Text>
          </View>
        </View>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* IMDb */}
        <View style={styles.scoreItem}>
          <View style={[styles.iconCircle, { backgroundColor: "#f5c51820" }]}>
            <TrendingUp size={14} color="#f5c518" />
          </View>
          <View>
            <Text style={styles.score}>
              {isLoading ? "..." : imdbRating || "N/A"}
            </Text>
            <Text style={styles.label}>IMDb</Text>
          </View>
        </View>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Rotten Tomatoes */}
        <View style={styles.scoreItem}>
          <View style={[styles.iconCircle, { backgroundColor: "#fa320a20" }]}>
            <BarChart2 size={14} color="#fa320a" />
          </View>
          <View>
            <Text style={styles.score}>
              {isLoading ? "..." : rtRating || "N/A"}
            </Text>
            <Text style={styles.label}>RT Meter</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
});
