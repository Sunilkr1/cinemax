import { QUERY_KEYS } from "@/lib/queryClient";
import { getMovieDetail } from "@/services/movies.service";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

export const useMovieDetail = (movieId: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.movieDetail(movieId, tmdbLang),
    queryFn: () => getMovieDetail(movieId, tmdbLang),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 10,
  });
};
