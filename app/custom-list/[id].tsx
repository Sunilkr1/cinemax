import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Film, Layers, Trash2 } from "lucide-react-native";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { FadeIn, FadeInList } from "@/components/animations/FadeIn";
import { MovieCard } from "@/components/ui/MovieCard";
import { Toast } from "@/components/ui/Toast";

// Hooks
import { useCustomLists } from "@/hooks/useCustomLists";
import { useWatchlist } from "@/hooks/useWatchlist";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";

export default function CustomListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    lists,
    remove: removeList,
    removeMovie,
    getContaining,
  } = useCustomLists();
  const { items: watchlistItems } = useWatchlist();

  const list = lists.find((l) => l.id === id);

  if (!list) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>List not found</Text>
      </View>
    );
  }

  // Get movie objects from watchlist for this list's IDs
  const movies = watchlistItems
    .filter((item) => list.movieIds.includes(item.movie.id))
    .map((item) => item.movie);

  const handleDeleteList = () => {
    Alert.alert(
      "Delete List",
      `Delete "${list.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeList(list.id);
            Toast.success("List Deleted");
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <FadeIn>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View
              style={[
                styles.listIcon,
                {
                  backgroundColor: list.color + "20",
                  borderColor: list.color + "40",
                },
              ]}
            >
              <Layers size={18} color={list.color} />
            </View>
            <View>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.listCount}>
                {list?.movieIds?.length || 0} movies
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteList}>
            <Trash2 size={17} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </FadeIn>

      {/* Movies */}
      {(movies?.length || 0) === 0 ? (
        <FadeIn>
          <View style={styles.empty}>
            <Film size={48} color={COLORS.textMuted} strokeWidth={1} />
            <Text style={styles.emptyTitle}>No Movies Yet</Text>
            <Text style={styles.emptySub}>
              Add movies from the detail page to this list
            </Text>
          </View>
        </FadeIn>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          numColumns={3}
          renderItem={({ item, index }) => (
            <FadeInList index={index}>
              <View style={styles.gridItem}>
                <MovieCard movie={item} variant="compact" />
              </View>
            </FadeInList>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  listName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  listCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(239,68,68,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
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
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  notFound: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});
