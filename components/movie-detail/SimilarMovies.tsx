import { MovieCard } from "@/components/ui/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionSkeleton } from "@/components/ui/SkeletonLoader";
import { SPACING } from "@/constants/theme";
import { Movie } from "@/types/movie.types";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface SimilarMoviesProps {
  movies: Movie[];
  isLoading?: boolean;
}

export const SimilarMovies = ({ movies, isLoading }: SimilarMoviesProps) => {
  if (isLoading) return <SectionSkeleton count={4} />;
  if (!movies?.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Similar Movies" icon="explore" hideSeeAll />
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item, index }) => (
          <MovieCard movie={item} variant="portrait" index={index} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: { paddingHorizontal: SPACING.base },
});
