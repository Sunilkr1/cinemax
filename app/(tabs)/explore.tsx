import { useQueryClient } from "@tanstack/react-query";
import { Compass } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MoodInputBox } from "@/components/ai/MoodInputBox";
import { BollywoodToggle } from "@/components/explore/BollywoodToggle";
import { CollectionsBrowser } from "@/components/explore/CollectionsBrowser";
import { TopByGenre } from "@/components/explore/TopByGenre";
import { MovieCard } from "@/components/ui/MovieCard";
import { SectionSkeleton } from "@/components/ui/SkeletonLoader";
import { Movie } from "@/types/movie.types";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useLanguage } from "@/hooks/useLanguage";
import {
  flattenPages,
  useBollywood,
  useTopRated,
  useUpcoming,
} from "@/hooks/useMovies";
import { useThemeColors } from "@/hooks/useTheme";
import { useTrending } from "@/hooks/useTrending";

type TabKey = "trending" | "upcoming" | "top_rated" | "bollywood";

const TABS: { key: TabKey; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "upcoming", label: "Upcoming" },
  { key: "top_rated", label: "Top Rated" },
  { key: "bollywood", label: "Bollywood" },
];

// ─── Tab Selector ─────────────────────────────────────────────
const TabSelector = ({
  activeTab,
  onSelect,
}: {
  activeTab: TabKey;
  onSelect: (tab: TabKey) => void;
}) => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.tabRow,
        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
      ]}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onSelect(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                active && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Header Component ─────────────────────────────────────────
const ExploreHeader = ({
  activeTab,
  isBollywood,
  moviesCount,
  isLoading,
  onTabSelect,
  onBollywoodToggle,
}: {
  activeTab: TabKey;
  isBollywood: boolean;
  moviesCount: number;
  isLoading: boolean;
  onTabSelect: (tab: TabKey) => void;
  onBollywoodToggle: (val: boolean) => void;
}) => {
  const colors = useThemeColors();
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Compass size={24} color={COLORS.primary} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Explore
        </Text>
      </View>

      {/* Bollywood / Hollywood Toggle */}
      <BollywoodToggle isBollywood={isBollywood} onToggle={onBollywoodToggle} />

      {/* Tab Selector */}
      <TabSelector activeTab={activeTab} onSelect={onTabSelect} />

      {/* AI Mood Box */}
      <MoodInputBox />

      {/* Top By Genre */}
      <TopByGenre />

      {/* Collections */}
      <CollectionsBrowser />

      {/* Grid Header */}
      <View style={styles.gridHeader}>
        <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>
          {TABS.find((t) => t.key === activeTab)?.label ?? "Movies"}
        </Text>
        {moviesCount > 0 && (
          <Text style={[styles.gridCount, { color: colors.textMuted }]}>
            {moviesCount} movies
          </Text>
        )}
      </View>

      {/* Loading Skeleton */}
      {isLoading && <SectionSkeleton variant="portrait" count={6} />}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { isHindi, toggle: toggleLang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("trending");
  const [refreshing, setRefreshing] = useState(false);

  // All hooks — always called unconditionally
  const trendingQuery = useTrending("week");
  const upcomingQuery = useUpcoming();
  const topRatedQuery = useTopRated();
  const bollywoodQuery = useBollywood();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  // Get current tab data
  const getTabData = (): { movies: Movie[]; isLoading: boolean } => {
    switch (activeTab) {
      case "trending":
        return {
          movies: (trendingQuery.data ?? []) as Movie[],
          isLoading: trendingQuery.isLoading,
        };
      case "upcoming":
        return {
          movies: flattenPages(upcomingQuery.data),
          isLoading: upcomingQuery.isLoading,
        };
      case "top_rated":
        return {
          movies: flattenPages(topRatedQuery.data),
          isLoading: topRatedQuery.isLoading,
        };
      case "bollywood":
        return {
          movies: flattenPages(bollywoodQuery.data),
          isLoading: bollywoodQuery.isLoading,
        };
      default:
        return { movies: [], isLoading: false };
    }
  };

  const { movies, isLoading } = getTabData();

  // Filter invalid items — prevents toString of undefined crash
  const safeMovies: Movie[] = movies.filter(
    (m): m is Movie =>
      m !== null && m !== undefined && typeof m.id === "number" && !isNaN(m.id),
  );

  // Bollywood toggle handler
  const handleBollywoodToggle = useCallback(
    (val: boolean) => {
      // val=true → Bollywood (Hindi), val=false → Hollywood
      if (val !== isHindi) {
        toggleLang();
      }
      // Switch to bollywood tab automatically
      if (val) {
        setActiveTab("bollywood");
      } else {
        setActiveTab("trending");
      }
    },
    [isHindi, toggleLang],
  );

  // Pagination on end reached
  const handleEndReached = useCallback(() => {
    switch (activeTab) {
      case "upcoming":
        if (upcomingQuery.hasNextPage && !upcomingQuery.isFetchingNextPage)
          upcomingQuery.fetchNextPage();
        break;
      case "top_rated":
        if (topRatedQuery.hasNextPage && !topRatedQuery.isFetchingNextPage)
          topRatedQuery.fetchNextPage();
        break;
      case "bollywood":
        if (bollywoodQuery.hasNextPage && !bollywoodQuery.isFetchingNextPage)
          bollywoodQuery.fetchNextPage();
        break;
    }
  }, [activeTab, upcomingQuery, topRatedQuery, bollywoodQuery]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <FlatList<Movie>
        data={safeMovies}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <ExploreHeader
            activeTab={activeTab}
            isBollywood={isHindi}
            moviesCount={safeMovies.length}
            isLoading={isLoading}
            onTabSelect={setActiveTab}
            onBollywoodToggle={handleBollywoodToggle}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MovieCard movie={item} variant="compact" showWatchlist={false} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: 3,
    borderWidth: 1,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: RADIUS.lg,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  gridCount: {
    fontSize: 12,
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
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
