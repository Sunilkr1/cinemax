import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Film, Layers, Star } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { MovieCard } from "@/components/ui/MovieCard";
import { MovieDetailSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks
import { useCollection } from "@/hooks/useCollections";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { getBackdropUrl } from "@/utils/getImageUrl";

const { width: W } = Dimensions.get("window");

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collectionId = parseInt(id, 10);
  const router = useRouter();

  const { data, isLoading } = useCollection(collectionId);

  if (isLoading) return <MovieDetailSkeleton />;
  if (!data) return null;

  const backdropUrl = getBackdropUrl(data.backdrop_path, "large");
  const { sortedParts, meta, stats } = data;

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedParts}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MovieCard movie={item} variant="compact" showWatchlist />
          </View>
        )}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <FadeIn>
              <View style={styles.hero}>
                {backdropUrl && (
                  <Image
                    source={{ uri: backdropUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={400}
                  />
                )}
                <LinearGradient
                  colors={[
                    "rgba(10,10,10,0.2)",
                    meta?.color ? meta.color + "60" : "rgba(229,9,20,0.4)",
                    COLORS.background,
                  ]}
                  style={StyleSheet.absoluteFill}
                />

                {/* Nav */}
                <View style={styles.nav}>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => router.back()}
                  >
                    <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.heroInfo}>
                  <View style={styles.collectionBadge}>
                    <Layers size={12} color={meta?.color || COLORS.primary} />
                    <Text
                      style={[
                        styles.collectionLabel,
                        { color: meta?.color || COLORS.primary },
                      ]}
                    >
                      Collection
                    </Text>
                  </View>
                  <Text style={styles.collectionName}>{data.name}</Text>
                  {data.overview && (
                    <Text style={styles.overview} numberOfLines={3}>
                      {data.overview}
                    </Text>
                  )}
                </View>
              </View>
            </FadeIn>

            {/* Stats */}
            <SlideUp delay={100}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Film size={16} color={COLORS.primary} />
                  <Text style={styles.statValue}>{stats.totalMovies}</Text>
                  <Text style={styles.statLabel}>Movies</Text>
                </View>
                <View style={styles.statCard}>
                  <Star size={16} color={COLORS.gold} fill={COLORS.gold} />
                  <Text style={styles.statValue}>{stats.avgRating}</Text>
                  <Text style={styles.statLabel}>Avg Rating</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>📅</Text>
                  <Text style={styles.statValue}>
                    {stats.startYear}–{stats.endYear}
                  </Text>
                  <Text style={styles.statLabel}>Years</Text>
                </View>
              </View>
            </SlideUp>

            {/* Grid header */}
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>All Movies</Text>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    height: 360,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  nav: {
    position: "absolute",
    top: 56,
    left: SPACING.base,
    zIndex: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  heroInfo: {
    padding: SPACING.base,
    gap: 8,
  },
  collectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  collectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  collectionName: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  overview: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statEmoji: { fontSize: 16 },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  gridHeader: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  gridTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  gridContent: {
    paddingHorizontal: SPACING.sm,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: SPACING.sm,
    maxWidth: "33.33%",
  },
});
