import { MovieCard } from "@/components/ui/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MovieCardSkeleton } from "@/components/ui/SkeletonLoader";
import { SPACING } from "@/constants/theme";
import { useDiscover } from "@/hooks/useMovies";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

/**
 * TrendingOTTSection displays movies recently added to popular streaming platforms in India.
 */
export const TrendingOTTSection = () => {
  // Common OTT Providers in India: 8 (Netflix), 119 (Prime), 122 (Hotstar), 337 (Disney+)
  const { data, isLoading } = useDiscover({
    watch_region: "IN",
    with_watch_providers: "8|119|122|337",
    sort_by: "primary_release_date.desc",
  });

  const results = data?.pages?.[0]?.results || [];

  if (!isLoading && results.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recently on OTT"
        subtitle="New on Netflix, Prime & more"
      />

      {isLoading ? (
        <FlatList
          horizontal
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => String(item)}
          renderItem={() => <MovieCardSkeleton variant="portrait" />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          horizontal
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <MovieCard movie={item} variant="portrait" index={index} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          snapToInterval={130 + SPACING.sm}
          decelerationRate="fast"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
  },
});
