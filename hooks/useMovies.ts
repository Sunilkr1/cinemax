import { QUERY_KEYS } from "@/lib/queryClient";
import {
  discoverMovies,
  getBollywoodMovies,
  getNowPlaying,
  getPopular,
  getTop10,
  getTopRated,
  getUpcoming,
} from "@/services/movies.service";
import { DiscoverParams } from "@/types/movie.types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

// ─── Now Playing ──────────────────────────────────────────────
export const useNowPlaying = () => {
  const { tmdbLang } = useLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.nowPlaying(1, tmdbLang),
    queryFn: ({ pageParam = 1 }) =>
      getNowPlaying(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Upcoming ─────────────────────────────────────────────────
export const useUpcoming = () => {
  const { tmdbLang } = useLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.upcoming(1, tmdbLang),
    queryFn: ({ pageParam = 1 }) => getUpcoming(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// ─── Top Rated ────────────────────────────────────────────────
export const useTopRated = () => {
  const { tmdbLang } = useLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.topRated(1, tmdbLang),
    queryFn: ({ pageParam = 1 }) => getTopRated(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// ─── Popular ──────────────────────────────────────────────────
export const usePopular = () => {
  const { tmdbLang } = useLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.popular(1, tmdbLang),
    queryFn: ({ pageParam = 1 }) => getPopular(pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// ─── Top 10 ───────────────────────────────────────────────────
export const useTop10 = () => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: ["movies", "top10", tmdbLang],
    queryFn: () => getTop10(tmdbLang),
    staleTime: 1000 * 60 * 30,
  });
};

// ─── Bollywood ────────────────────────────────────────────────
export const useBollywood = () => {
  return useInfiniteQuery({
    queryKey: ["movies", "bollywood"],
    queryFn: ({ pageParam = 1 }) => getBollywoodMovies(pageParam as number),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// ─── Discover ─────────────────────────────────────────────────
export const useDiscover = (params: DiscoverParams) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.discover(params as Record<string, unknown>),
    queryFn: ({ pageParam = 1 }) =>
      discoverMovies({ ...params, page: pageParam as number }),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
    enabled: Object.keys(params).length > 0,
  });
};

// ─── Flatten infinite pages helper ────────────────────────────
export const flattenPages = <T>(
  data: { pages: { results: T[] }[] } | undefined,
): T[] => {
  if (!data) return [];
  return data.pages.flatMap((page) => page.results);
};
