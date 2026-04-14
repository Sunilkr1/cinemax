import { fetchExtraRatings } from "@/services/ratings.service";
import { useQuery } from "@tanstack/react-query";

export const useExtraRatings = (imdbId: string | null) => {
  return useQuery({
    queryKey: ["ratings", imdbId],
    queryFn: () => fetchExtraRatings(imdbId!),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 60 * 24, // Ratings don't change often
  });
};
