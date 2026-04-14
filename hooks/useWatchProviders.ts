import { QUERY_KEYS } from "@/lib/queryClient";
import {
  extractIndiaProviders,
  getWatchProviders,
} from "@/services/movies.service";
import { useQuery } from "@tanstack/react-query";

export const useWatchProviders = (movieId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.movieWatchProviders(movieId),
    queryFn: () => getWatchProviders(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60 * 6,
    select: (data) => extractIndiaProviders(data),
  });
};
