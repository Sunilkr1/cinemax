import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { Movie } from "@/types/movie.types";
import { getPosterUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TopTenListProps {
  movies: Movie[];
}

const Top10Card = ({ movie, rank }: { movie: Movie; rank: number }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const posterUrl = getPosterUrl(movie.poster_path, "large");

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rankColor =
    rank === 1 ? COLORS.gold : rank <= 3 ? COLORS.primary : COLORS.textPrimary;

  return (
    <AnimatedTouchable
      style={[styles.card, animStyle]}
      onPress={() => router.push(`/movie/${movie.id}`)}
      onPressIn={() => {
        scale.value = withSpring(0.94);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      activeOpacity={1}
    >
      <View style={styles.posterWrap}>
        <Image
          source={posterUrl ? { uri: posterUrl } : undefined}
          style={styles.poster}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.ratingBadge}>
          <Star size={9} color={COLORS.gold} fill={COLORS.gold} />
          <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
        </View>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />
      </View>
      <Text style={[styles.rankNum, { color: rankColor }]}>{rank}</Text>
    </AnimatedTouchable>
  );
};

export const TopTenList = ({ movies }: TopTenListProps) => {
  if (!movies?.length) return null;

  return (
    <FadeIn delay={150}>
      <View style={styles.container}>
        <SectionHeader
          title="Top 10 This Week"
          icon="topRated"
          seeAllRoute="/(tabs)/explore"
        />
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <Top10Card movie={item} rank={index + 1} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </FadeIn>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.lg,
  },
  cardWrapper: { paddingTop: 10 },
  card: { width: 150, marginRight: SPACING.md },
  posterWrap: {
    width: 150,
    height: 220,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.lg,
  },
  poster: { width: "100%", height: "100%" },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    zIndex: 1,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "700",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  rankNum: {
    fontSize: 76,
    fontWeight: "900",
    lineHeight: 80,
    marginTop: -14,
    marginLeft: -4,
    textShadowColor: "#000",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10,
  },
});
