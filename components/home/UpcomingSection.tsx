import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { Movie } from "@/types/movie.types";
import { formatRelativeDate } from "@/utils/formatDate";
import { getPosterUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UpcomingSectionProps {
  movies: Movie[];
}

const UpcomingCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const posterUrl = getPosterUrl(movie.poster_path, "large");
  const releaseLabel = formatRelativeDate(
    movie.release_date || movie.first_air_date || "",
  );

  return (
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
      <Image
        source={posterUrl ? { uri: posterUrl } : undefined}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.92)"]}
        style={styles.gradient}
      >
        <View style={styles.releaseBadge}>
          <Calendar size={10} color={COLORS.info} />
          <Text style={styles.releaseText}>{releaseLabel}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || movie.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const UpcomingSection = ({ movies }: UpcomingSectionProps) => {
  if (!movies?.length) return null;

  return (
    <FadeIn delay={200}>
      <View style={styles.container}>
        <SectionHeader
          title="Coming Soon"
          subtitle="Don't miss upcoming releases"
          icon="upcoming"
          seeAllRoute="/(tabs)/explore"
        />
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => <UpcomingCard movie={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </FadeIn>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: { paddingHorizontal: SPACING.base },
  card: {
    width: 140,
    height: 210,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.md,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
    justifyContent: "flex-end",
    padding: 10,
    gap: 6,
  },
  releaseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,130,246,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
  },
  releaseText: {
    color: COLORS.info,
    fontSize: 9,
    fontWeight: "700",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
  },
});
