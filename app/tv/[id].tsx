import { CriticsMeter } from "@/components/movie-detail/CriticsMeter";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useExtraRatings } from "@/hooks/useExtraRatings";
import { useTVDetail } from "@/hooks/useTVDetail";
import { getYear } from "@/utils/formatDate";
import { getPosterUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Play,
  Share2,
  Star,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: tv, isLoading } = useTVDetail(Number(id));
  const { data: extraRatings, isLoading: isRatingsLoading } = useExtraRatings(
    tv?.external_ids?.imdb_id || null,
  );

  if (isLoading || !tv) return <View style={styles.loading} />;

  const posterUrl = getPosterUrl(tv.poster_path, "large");

  const handleShare = () => {
    Share.share({
      message: `Check out ${tv.name} on CineMax!`,
      url: tv.homepage || "",
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Poster Blur */}
      <Image
        source={{ uri: posterUrl || "" }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={10}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0,0,0,0.7)" },
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header/Back */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
            <Share2 color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Image
            source={{ uri: posterUrl || "" }}
            style={styles.mainPoster}
            contentFit="cover"
            transition={300}
          />

          <Text style={styles.title}>{tv.name}</Text>
          <Text style={styles.tagline}>{tv.tagline}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Star size={14} color={COLORS.gold} fill={COLORS.gold} />
              <Text style={styles.statText}>{tv.vote_average.toFixed(1)}</Text>
            </View>
            <View style={styles.stat}>
              <Calendar size={14} color={COLORS.textMuted} />
              <Text style={styles.statText}>
                {getYear(tv.first_air_date || "")}
              </Text>
            </View>
            <View style={styles.stat}>
              <Layers size={14} color={COLORS.textMuted} />
              <Text style={styles.statText}>
                {tv.number_of_seasons} Seasons
              </Text>
            </View>
          </View>

          {/* Critics vs Audience Meter */}
          <View style={styles.criticsRow}>
            <CriticsMeter
              tmdbRating={tv.vote_average}
              imdbRating={extraRatings?.imdb || null}
              rtRating={extraRatings?.rottenTomatoes || null}
              isLoading={isRatingsLoading}
            />
          </View>

          {/* Watch Now Button */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() =>
              router.push({
                pathname: "/player/[id]",
                params: { id: tv.id, type: "tv" },
              })
            }
          >
            <Play size={20} color="#000" fill="#000" />
            <Text style={styles.playBtnText}>Watch Now</Text>
          </TouchableOpacity>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{tv.overview}</Text>
          </View>

          {/* New Series Meta */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Episodes</Text>
              <Text style={styles.metaValue}>{tv.number_of_episodes}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{tv.status}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loading: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: 20,
  },
  mainPoster: {
    width: 200,
    height: 300,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  criticsRow: {
    width: "100%",
    marginTop: 25,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 20,
    textAlign: "center",
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  playBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 56,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 30,
  },
  playBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  section: {
    width: "100%",
    marginTop: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  overview: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    lineHeight: 24,
  },
  metaGrid: {
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
    gap: 30,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
