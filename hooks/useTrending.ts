import { QUERY_KEYS } from "@/lib/queryClient";
import { getTrending } from "@/services/movies.service";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

export const useTrending = (period: "day" | "week" = "day") => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.trending(period, tmdbLang),
    queryFn: () => getTrending(period, tmdbLang),
    staleTime: 1000 * 60 * 15, // 15 min for trending
    select: (data) => data.results,
  });
};
