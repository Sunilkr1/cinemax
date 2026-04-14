import { FadeIn } from "@/components/animations/FadeIn";
import { MovieCard } from "@/components/ui/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SPACING } from "@/constants/theme";
import { Movie } from "@/types/movie.types";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface TopRatedSectionProps {
  movies: Movie[];
  title?: string;
}

export const TopRatedSection = ({
  movies,
  title = "Top Rated All Time",
}: TopRatedSectionProps) => {
  if (!movies?.length) return null;

  return (
    <FadeIn delay={250}>
      <View style={styles.container}>
        <SectionHeader
          title={title}
          icon="star"
          seeAllRoute="/(tabs)/explore"
        />
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => (
            <MovieCard movie={item} variant="portrait" />
          )}
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
});
