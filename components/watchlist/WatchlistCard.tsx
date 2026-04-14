import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { WatchlistItem } from "@/types/watchlist.types";
import { formatShortDate } from "@/utils/formatDate";
import { getPosterUrl } from "@/utils/getImageUrl";
import { getRatingColor } from "@/utils/getRatingColor";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, Star, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (movieId: number) => void;
}

export const WatchlistCard = ({ item, onRemove }: WatchlistCardProps) => {
  const router = useRouter();
  const { movie, addedAt } = item;
  const posterUrl = getPosterUrl(movie.poster_path, "medium");
  const ratingColor = getRatingColor(movie.vote_average);

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => onRemove(movie.id)}
    >
      <Trash2 size={20} color="#fff" />
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          const type = movie.media_type || (movie.title ? "movie" : "tv");
          router.push({
            pathname: type === "movie" ? "/movie/[id]" : "/tv/[id]",
            params: { id: movie.id },
          });
        }}
        activeOpacity={0.88}
      >
        {/* Poster */}
        <Image
          source={posterUrl ? { uri: posterUrl } : undefined}
          style={styles.poster}
          contentFit="cover"
          transition={200}
        />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.rating, { borderColor: ratingColor + "40" }]}>
              <Star size={10} color={ratingColor} fill={ratingColor} />
              <Text style={[styles.ratingText, { color: ratingColor }]}>
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.year}>
              {(movie.release_date || movie.first_air_date)?.split("-")[0]}
            </Text>
          </View>

          <Text style={styles.overview} numberOfLines={2}>
            {movie.overview}
          </Text>

          <View style={styles.addedRow}>
            <Calendar size={10} color={COLORS.textMuted} />
            <Text style={styles.addedText}>
              Added {formatShortDate(new Date(addedAt).toISOString())}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

// Default export bhi add karo backup ke liye
export default WatchlistCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  poster: {
    width: 90,
    height: 130,
  },
  info: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
  },
  ratingText: { fontSize: 10, fontWeight: "700" },
  year: { color: COLORS.textMuted, fontSize: 12 },
  overview: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addedText: { color: COLORS.textMuted, fontSize: 10 },
  deleteAction: {
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.sm,
    marginRight: SPACING.base,
    gap: 4,
  },
  deleteText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
