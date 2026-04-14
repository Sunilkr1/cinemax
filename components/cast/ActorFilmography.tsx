import { MovieCard } from "@/components/ui/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionSkeleton } from "@/components/ui/SkeletonLoader";
import { SPACING } from "@/constants/theme";
import { usePersonMovies } from "@/hooks/useCast";
import { Movie } from "@/types/movie.types";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface ActorFilmographyProps {
  personId: number;
}

export const ActorFilmography = ({ personId }: ActorFilmographyProps) => {
  const { data: movies, isLoading } = usePersonMovies(personId);

  if (isLoading) return <SectionSkeleton variant="portrait" count={4} />;
  if (!movies?.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Known For"
        subtitle={`${movies.length} films`}
        hideSeeAll
      />
      <FlatList
        horizontal
        data={movies as unknown as Movie[]}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <MovieCard movie={item as unknown as Movie} variant="portrait" />
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
