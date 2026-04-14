import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { ContinueWatchingItem } from "@/types/watchlist.types";
import { getPosterUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { PlayCircle, X } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ContinueWatchingProps {
  items: ContinueWatchingItem[];
  onRemove: (movieId: number) => void;
}

export const ContinueWatching = ({
  items,
  onRemove,
}: ContinueWatchingProps) => {
  const router = useRouter();

  if (!items?.length) return null;

  return (
    <FadeIn delay={80}>
      <View style={styles.container}>
        <SectionHeader title="Continue Watching" icon="nowPlaying" hideSeeAll />
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item, index) => String(item?.movieId ?? index)}
          renderItem={({ item }) => {
            const posterUrl = item.poster_path
              ? getPosterUrl(item.poster_path, "medium")
              : null;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/movie/${item.movieId}`)}
                activeOpacity={0.88}
              >
                <Image
                  source={posterUrl ? { uri: posterUrl } : undefined}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={200}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.88)"]}
                  style={styles.gradient}
                >
                  <PlayCircle
                    size={22}
                    color="#fff"
                    fill="rgba(229,9,20,0.8)"
                  />
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                </LinearGradient>

                {/* Remove btn */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemove(item.movieId)}
                >
                  <X size={10} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
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
    width: 130,
    height: 195,
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
    height: "60%",
    justifyContent: "flex-end",
    padding: 10,
    gap: 6,
  },
  title: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  removeBtn: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
