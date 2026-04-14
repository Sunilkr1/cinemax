import { GENRE_LIST } from "@/constants/genres";
import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryClient";
import { Genre } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useLanguage } from "./useLanguage";

interface GenreResponse {
  genres: Genre[];
}

export const useGenres = () => {
  const { tmdbLang } = useLanguage();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const genreQuery = useQuery({
    queryKey: QUERY_KEYS.genres(tmdbLang),
    queryFn: () =>
      get<GenreResponse>(ENDPOINTS.GENRE_LIST, { language: tmdbLang }),
    staleTime: 1000 * 60 * 60 * 24, // 24hrs — genres rarely change
    select: (data) => data.genres,
    placeholderData: { genres: GENRE_LIST }, // use local fallback
  });

  const selectGenre = useCallback((id: number | null) => {
    setSelectedGenre((prev) => (prev === id ? null : id));
  }, []);

  return {
    genres: genreQuery.data || GENRE_LIST,
    selectedGenre,
    selectGenre,
    isLoading: genreQuery.isLoading,
  };
};
