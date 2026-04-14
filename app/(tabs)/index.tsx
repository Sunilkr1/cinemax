import { NotificationDrawer } from "@/components/home/NotificationDrawer";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Bell, Film, Search } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { AIRecommendations } from "@/components/ai/AIRecommendations";
import { FadeIn } from "@/components/animations/FadeIn";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { ContinueWatching } from "@/components/home/ContinueWatching";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeMediaToggle, MediaType } from "@/components/home/HomeMediaToggle";
import { RegionExplorer } from "@/components/home/RegionExplorer";
import { TopRatedSection } from "@/components/home/TopRatedSection";
import { TopTenList } from "@/components/home/TopTenList";
import { TrendingOTTSection } from "@/components/home/TrendingOTTSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { UpcomingSection } from "@/components/home/UpcomingSection";
import { GenreFilterChips } from "@/components/search/GenreFilterChips";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HeroSkeleton, SectionSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useLanguage } from "@/hooks/useLanguage";
import {
  flattenPages,
  useNowPlaying,
  useTop10,
  useTopRated,
  useUpcoming,
} from "@/hooks/useMovies";
import { useOffline } from "@/hooks/useOffline";
import { useTMDBNotifications } from "@/hooks/useTMDBNotifications";
import { useTrending } from "@/hooks/useTrending";
import { useTopRatedTV, useTrendingTV } from "@/hooks/useTV";
import { Storage } from "@/lib/storage";
import { useEffect } from "react";

import { COLORS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { Movie } from "@/types/movie.types";

const { width: W } = Dimensions.get("window");

// ─── Offline Banner ───────────────────────────────────────────
const OfflineBanner = () => (
  <FadeIn>
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        📡 You're offline — Showing cached content
      </Text>
    </View>
  </FadeIn>
);

// ─── Header ───────────────────────────────────────────────────
const HomeHeader = ({
  onOpenNotifs,
  topInset,
  unreadCount,
}: {
  onOpenNotifs: () => void;
  topInset: number;
  unreadCount: number;
}) => {
  const router = useRouter();
  const { language } = useLanguage();
  const colors = useThemeColors();

  return (
    <View style={[styles.header, { paddingTop: topInset + 6 }]}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Film size={20} color={COLORS.primary} />
        <Text style={styles.logo}>
          CINE<Text style={{ color: colors.textPrimary }}>MAX</Text>
        </Text>
      </View>

      {/* Right actions */}
      <View style={styles.headerRight}>
        {/* Language badge */}
        <View
          style={[
            styles.langBadge,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.langText, { color: colors.textPrimary }]}>
            {language.flag}
          </Text>
        </View>

        {/* Search shortcut */}
        <TouchableOpacity
          style={[
            styles.headerBtn,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={() => router.push("/(tabs)/search")}
        >
          <Search size={18} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[
            styles.headerBtn,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={onOpenNotifs}
        >
          <Bell size={18} color={colors.textPrimary} strokeWidth={2} />
          {unreadCount > 0 && (
            <View style={[styles.notifDot, { borderColor: colors.surface }]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Main Home Screen ─────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { isOffline } = useOffline();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  // TMDB Sky-notifications (Automated news)
  useTMDBNotifications();

  // Notification Drawer Ref
  const notifRef = React.useRef<BottomSheet>(null);
  const handleOpenNotifs = () => notifRef.current?.expand();

  const { items: continueItems, remove: removeContinue } =
    useContinueWatching();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkUnread = () => {
      const notifs = Storage.getJSON<any[]>("local_notifications") || [];
      const count = notifs.filter((n) => n.read === false).length;
      setUnreadCount(count);
    };
    checkUnread();
    const interval = setInterval(checkUnread, 2000); // Slightly faster poll
    return () => clearInterval(interval);
  }, []);

  const [mediaType, setMediaType] = useState<MediaType>("movie");

  // ── Movie Data ─────────────────────────────────────────────
  const { data: nowPlayingData, isLoading: heroLoading } = useNowPlaying();
  const { data: trendingData, isLoading: trendingLoading } = useTrending("day");
  const { data: top10Data, isLoading: top10Loading } = useTop10();
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcoming();
  const { data: topRatedData, isLoading: topRatedLoading } = useTopRated();

  // ── TV Data (Only fetched if needed or pre-cached) ───────────
  const { data: trendingTVData, isLoading: trendingTVLoading } =
    useTrendingTV("day");
  const { data: topRatedTVData, isLoading: topRatedTVLoading } =
    useTopRatedTV();
  // const { data: upcomingTVData } = useUpcomingTV();

  // ── Flattening ─────────────────────────────────────────────
  const nowPlayingMovies = flattenPages(nowPlayingData);
  const trendingMovies: Movie[] = trendingData || [];
  const top10Movies: Movie[] = top10Data || [];
  const upcomingMovies = flattenPages(upcomingData);
  const topRatedMovies = flattenPages(topRatedData);

  const trendingTV = trendingTVData?.results || [];
  const topRatedTV = flattenPages(topRatedTVData as any) as Movie[];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      {/* Sticky blur header */}
      <BlurView
        intensity={60}
        tint={colors.background === "#f5f5f5" ? "light" : "dark"}
        style={[styles.headerBlur, { paddingTop: 0 }]}
      >
        <HomeHeader
          onOpenNotifs={handleOpenNotifs}
          topInset={insets.top}
          unreadCount={unreadCount}
        />
      </BlurView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 64 + insets.top, backgroundColor: colors.background },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Offline banner */}
        {isOffline && <OfflineBanner />}

        {/* ── Media Switch ─────────────────────────────────── */}
        <HomeMediaToggle value={mediaType} onValueChange={setMediaType} />

        {/* ── Hero Slider ──────────────────────────────────── */}
        {heroLoading ? (
          <HeroSkeleton />
        ) : (
          <HeroSlider movies={nowPlayingMovies.slice(0, 6)} />
        )}

        {/* ── Continue Watching ─────────────────────────────── */}
        <ContinueWatching items={continueItems} onRemove={removeContinue} />

        {/* ── Genre Filter ──────────────────────────────────── */}
        <FadeIn delay={100}>
          <View style={styles.genreSection}>
            <SectionHeader title="Browse by Genre" icon="explore" hideSeeAll />
            <GenreFilterChips
              selectedGenre={selectedGenre}
              onSelect={setSelectedGenre}
            />
          </View>
        </FadeIn>

        {/* ── Trending ──────────────────────────────────────── */}
        {mediaType === "movie" ? (
          trendingLoading ? (
            <SectionSkeleton variant="portrait" count={5} />
          ) : (
            <TrendingSection movies={trendingMovies} />
          )
        ) : trendingTVLoading ? (
          <SectionSkeleton variant="portrait" count={5} />
        ) : (
          <TrendingSection movies={trendingTV as any} />
        )}

        {/* ── Top 10 (Only for movies usually) ─────────────── */}
        {mediaType === "movie" &&
          (top10Loading ? (
            <SectionSkeleton variant="top10" count={5} />
          ) : (
            <TopTenList movies={top10Movies} />
          ))}

        {/* ── OTT Tracking ──────────────────────────────────── */}
        <TrendingOTTSection />

        {/* ── AI Recommendations ────────────────────────────── */}
        <AIRecommendations />

        {/* ── Region Hub ────────────────────────────────────── */}
        <RegionExplorer />

        {/* ── Dynamic Content ────────────────────────────────── */}
        {mediaType === "movie" ? (
          <>
            {upcomingLoading ? (
              <SectionSkeleton variant="portrait" count={5} />
            ) : (
              <UpcomingSection movies={upcomingMovies.slice(0, 10)} />
            )}

            {topRatedLoading ? (
              <SectionSkeleton variant="portrait" count={5} />
            ) : (
              <TopRatedSection movies={topRatedMovies.slice(0, 15)} />
            )}
          </>
        ) : (
          <>
            {topRatedTVLoading ? (
              <SectionSkeleton variant="portrait" count={5} />
            ) : (
              <TopRatedSection
                title="Top Rated Series"
                movies={topRatedTV as any}
              />
            )}
          </>
        )}

        {/* ── Collections ───────────────────────────────────── */}
        <CollectionsSection />

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Notification Drawer */}
      <NotificationDrawer ref={notifRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langText: { fontSize: 16 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  scroll: {},
  offlineBanner: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    backgroundColor: "rgba(234,179,8,0.12)",
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.25)",
  },
  offlineText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  genreSection: {
    marginBottom: SPACING.xl,
  },
});
