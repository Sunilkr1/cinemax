import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Dices,
  Film,
  Search as SearchIcon,
  Star,
  User,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
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
import {
  AdvancedFilter,
  FilterOptions,
} from "@/components/search/AdvancedFilter";
import { GenreFilterChips } from "@/components/search/GenreFilterChips";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchHistory } from "@/components/search/SearchHistory";
import { VoiceSearch } from "@/components/search/VoiceSearch";
import { SearchResultSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks
import { useGenres } from "@/hooks/useGenres";
import { useSearch } from "@/hooks/useSearch";

import { GENRES } from "@/constants/genres";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { getYear } from "@/utils/formatDate";
import { getPosterUrl } from "@/utils/getImageUrl";
import { getRatingColor } from "@/utils/getRatingColor";

const { width: W } = Dimensions.get("window");

// ─── Search Result Card ───────────────────────────────────────
const SearchResultCard = React.memo(
  ({
    item,
    index,
    onPress,
  }: {
    item: any;
    index: number;
    onPress: () => void;
  }) => {
    const posterPath = item.poster_path || item.profile_path;
    const posterUrl = getPosterUrl(posterPath, "medium");
    const ratingColor = getRatingColor(item.vote_average || 0);
    const genreNames = item.genre_ids
      ?.slice(0, 2)
      .map((id: number) => GENRES[id])
      .filter(Boolean);

    const isPerson = item.media_type === "person";
    const isTV =
      item.media_type === "tv" || (!item.title && !!item.name && !isPerson);
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;

    return (
      <FadeInList index={index}>
        <TouchableOpacity
          style={styles.resultCard}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {/* Poster */}
          <View style={styles.resultPoster}>
            {posterUrl ? (
              <Image
                source={{ uri: posterUrl }}
                style={styles.posterImg}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.posterFallback}>
                {isPerson ? (
                  <User size={22} color={COLORS.textMuted} />
                ) : (
                  <Film size={22} color={COLORS.textMuted} />
                )}
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.resultInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.resultTitle} numberOfLines={2}>
                {title}
              </Text>
              {isTV && (
                <View style={styles.seriesBadge}>
                  <Text style={styles.seriesBadgeText}>SERIES</Text>
                </View>
              )}
            </View>

            <View style={styles.resultMeta}>
              {!isPerson && (
                <View
                  style={[
                    styles.ratingBadge,
                    { borderColor: ratingColor + "40" },
                  ]}
                >
                  <Star size={10} color={ratingColor} fill={ratingColor} />
                  <Text style={[styles.ratingText, { color: ratingColor }]}>
                    {(item.vote_average || 0).toFixed(1)}
                  </Text>
                </View>
              )}
              {!!date && <Text style={styles.yearText}>{getYear(date)}</Text>}
              {item.original_language && !isPerson && (
                <View style={styles.langBadge}>
                  <Text style={styles.langText}>
                    {item.original_language.toUpperCase()}
                  </Text>
                </View>
              )}
              {isPerson && (
                <Text style={styles.departmentText}>
                  {item.known_for_department}
                </Text>
              )}
            </View>

            {(genreNames?.length || 0) > 0 && (
              <View style={styles.genreRow}>
                {genreNames.map((g: string) => (
                  <View key={g} style={styles.genreTag}>
                    <Text style={styles.genreTagText}>{g}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.overview} numberOfLines={2}>
              {item.overview}
            </Text>
          </View>
        </TouchableOpacity>
      </FadeInList>
    );
  },
);

// ─── Empty state ─────────────────────────────────────────────
const EmptyState = ({ query }: { query: string }) => (
  <FadeIn>
    <View style={styles.emptyState}>
      <SearchIcon size={48} color={COLORS.textMuted} strokeWidth={1} />
      <Text style={styles.emptyTitle}>No results for</Text>
      <Text style={styles.emptyQuery}>"{query}"</Text>
      <Text style={styles.emptyHint}>
        Try a different title, actor, or genre
      </Text>
    </View>
  </FadeIn>
);

// ─── Initial state ────────────────────────────────────────────
const InitialState = () => (
  <FadeIn>
    <View style={styles.initialState}>
      <Film size={52} color={COLORS.primary} strokeWidth={1} />
      <Text style={styles.initialTitle}>Find Your Next Favorite</Text>
      <Text style={styles.initialSub}>
        Search movies, actors, directors and more
      </Text>
    </View>
  </FadeIn>
);

// ─── Main Search Screen ───────────────────────────────────────
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const router = useRouter();
  const {
    query,
    results,
    history,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleQueryChange,
    submitSearch,
    removeHistory,
    clearHistory,
    clearSearch,
    isEmpty,
    showHistory,
  } = useSearch();

  const { selectedGenre, selectGenre } = useGenres();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isRolling, setIsRolling] = useState(false);

  const handleFeelingLucky = useCallback(async () => {
    if (isRolling) return;
    setIsRolling(true);
    try {
      // Pick a random page from top rated movies (limit to 500 pages of TMDB)
      const randomPage = Math.floor(Math.random() * 20) + 1;
      const { getTopRated } = await import("@/services/movies.service");
      const resp = await getTopRated(randomPage);
      if (resp.results.length > 0) {
        const randomMovie =
          resp.results[Math.floor(Math.random() * resp.results.length)];
        router.push(`/movie/${randomMovie.id}`);
      }
    } catch (error) {
      console.error("Dice roll failed:", error);
    } finally {
      setIsRolling(false);
    }
  }, [isRolling, router]);

  const handleHistorySelect = useCallback(
    (q: string) => {
      submitSearch(q);
    },
    [submitSearch],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <FadeIn>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Search
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleFeelingLucky}
              style={[
                styles.diceBtn,
                isRolling && { opacity: 0.5, transform: [{ scale: 0.9 }] },
              ]}
              disabled={isRolling}
            >
              <Dices size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <VoiceSearch onResult={handleQueryChange} size={38} />
          </View>
        </View>
      </FadeIn>

      {/* Search Bar */}
      <FadeIn delay={50}>
        <SearchBar
          value={query}
          onChangeText={handleQueryChange}
          onSubmit={() => submitSearch(query)}
          onClear={clearSearch}
          onFilterPress={() => setFilterVisible(true)}
          autoFocus={false}
        />
      </FadeIn>

      {/* Results / History / Initial */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item, index }) => (
          <SearchResultCard
            item={item}
            index={index}
            onPress={() => {
              if (query.trim().length >= 2) {
                submitSearch(query);
              }
              const type = item.media_type || (item.title ? "movie" : "tv");
              if (type === "person") {
                // Future: Person detail screen
                return;
              }
              router.push({
                pathname: type === "movie" ? "/movie/[id]" : "/tv/[id]",
                params: { id: item.id },
              });
            }}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Genre filter */}
            <FadeIn delay={80}>
              <GenreFilterChips
                selectedGenre={selectedGenre}
                onSelect={selectGenre}
              />
            </FadeIn>

            {/* Advanced AI Mood Search */}
            <FadeIn delay={100}>
              <MoodInputBox />
            </FadeIn>

            {/* History (when no query) */}
            {showHistory && (
              <SearchHistory
                history={history}
                onSelect={handleHistorySelect}
                onRemove={removeHistory}
                onClear={clearHistory}
              />
            )}

            {/* Loading skeletons */}
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <SearchResultSkeleton key={i} />
                ))}
              </>
            )}

            {/* Empty state */}
            {isEmpty && <EmptyState query={query} />}

            {/* Initial state */}
            {!query && !(history?.length || 0) && <InitialState />}
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? <SearchResultSkeleton /> : null
        }
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        initialFilters={filters}
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  diceBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: {
    paddingBottom: 100,
  },
  resultCard: {
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
  resultPoster: {
    width: 80,
    height: 120,
    overflow: "hidden",
  },
  posterImg: { width: "100%", height: "100%" },
  posterFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  resultInfo: {
    flex: 1,
    padding: SPACING.sm,
    gap: 5,
  },
  resultTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  seriesBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  seriesBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "900",
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
  },
  ratingText: { fontSize: 10, fontWeight: "700" },
  yearText: { color: COLORS.textMuted, fontSize: 12 },
  langBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceLight,
  },
  langText: { color: COLORS.textMuted, fontSize: 9, fontWeight: "700" },
  departmentText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
  },
  genreRow: { flexDirection: "row", gap: 5 },
  genreTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + "18",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  genreTagText: { color: COLORS.primary, fontSize: 9, fontWeight: "700" },
  overview: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyQuery: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyHint: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  initialState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  initialTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  initialSub: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
});
