import { QUERY_KEYS } from "@/lib/queryClient";
import {
  getPopularTV,
  getTopRatedTV,
  getTrendingTV,
  getUpcomingTV,
  discoverTV,
} from "@/services/tv.service";
import { DiscoverParams } from "@/types/movie.types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

export const useTrendingTV = (period: "day" | "week" = "day") => {
  const { tmdbLang } = useLanguage();
  return useQuery({
    queryKey: ["tv", "trending", period, tmdbLang],
    queryFn: () => getTrendingTV(period, tmdbLang),
    staleTime: 1000 * 60 * 10,
  });
};

export const usePopularTV = () => {
  const { tmdbLang } = useLanguage();
  return useInfiniteQuery({
    queryKey: ["tv", "popular", tmdbLang],
    queryFn: ({ pageParam = 1 }) => getPopularTV(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTopRatedTV = () => {
  const { tmdbLang } = useLanguage();
  return useInfiniteQuery({
    queryKey: ["tv", "topRated", tmdbLang],
    queryFn: ({ pageParam = 1 }) => getTopRatedTV(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useDiscoverTV = (params: DiscoverParams) => {
  return useInfiniteQuery({
    queryKey: ["tv", "discover", params],
    queryFn: ({ pageParam = 1 }) =>
      discoverTV({ ...params, page: pageParam as number }),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// ─── Upcoming TV ──────────────────────────────────────────────
export const useUpcomingTV = () => {
  const { tmdbLang } = useLanguage();
  return useInfiniteQuery({
    queryKey: ["tv", "upcoming", tmdbLang],
    queryFn: ({ pageParam = 1 }) => getUpcomingTV(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};
