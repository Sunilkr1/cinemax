import { GenreFilterChips } from "@/components/search/GenreFilterChips";
import { MovieCard } from "@/components/ui/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionSkeleton } from "@/components/ui/SkeletonLoader";
import { GENRES } from "@/constants/genres";
import { SPACING } from "@/constants/theme";
import { flattenPages, useDiscover } from "@/hooks/useMovies";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export const TopByGenre = () => {
  const [selectedGenre, setSelectedGenre] = useState<number>(28);

  const { data, isLoading } = useDiscover({
    with_genres: String(selectedGenre ?? ""),
    sort_by: "vote_average.desc",
    "vote_count.gte": 200,
    include_adult: false,
  });

  const movies = flattenPages(data);
  const genreName = GENRES[selectedGenre] || "Movies";

  return (
    <View style={styles.container}>
      <SectionHeader title={`Top ${genreName} Movies`} icon="star" hideSeeAll />
      <GenreFilterChips
        selectedGenre={selectedGenre}
        onSelect={(id) => id && setSelectedGenre(id)}
      />
      {isLoading ? (
        <SectionSkeleton variant="portrait" count={5} />
      ) : (
        <FlatList
          horizontal
          data={movies?.slice(0, 15) || []}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => (
            <MovieCard movie={item} variant="portrait" />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: { paddingHorizontal: SPACING.base },
});
