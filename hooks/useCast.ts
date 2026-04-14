import { QUERY_KEYS } from "@/lib/queryClient";
import {
  getDirector,
  getKeyCrew,
  getMovieCredits,
  getPersonDetail,
  getPersonMovieCredits,
  getSortedFilmography,
  getTopCast,
} from "@/services/cast.service";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

// ─── Movie credits ────────────────────────────────────────────
export const useMovieCredits = (movieId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.movieCredits(movieId),
    queryFn: () => getMovieCredits(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30,
    select: (data) => ({
      cast: getTopCast(data, 15),
      director: getDirector(data),
      crew: getKeyCrew(data),
      fullCast: data.cast,
      fullCrew: data.crew,
    }),
  });
};

// ─── Person / actor detail ────────────────────────────────────
export const usePersonDetail = (personId: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.personDetail(personId),
    queryFn: () => getPersonDetail(personId, tmdbLang),
    enabled: !!personId,
    staleTime: 1000 * 60 * 60,
  });
};

// ─── Person filmography ───────────────────────────────────────
export const usePersonMovies = (personId: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.personMovies(personId, tmdbLang),
    queryFn: () => getPersonMovieCredits(personId, tmdbLang),
    enabled: !!personId,
    staleTime: 1000 * 60 * 30,
    select: (data) => getSortedFilmography(data, 24),
  });
};
