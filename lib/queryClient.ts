import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 30, // 30 minutes in cache
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys — single source of truth
export const QUERY_KEYS = {
  // Movies
  nowPlaying: (page: number, lang: string) => [
    "movies",
    "now-playing",
    page,
    lang,
  ],
  upcoming: (page: number, lang: string) => ["movies", "upcoming", page, lang],
  topRated: (page: number, lang: string) => ["movies", "top-rated", page, lang],
  popular: (page: number, lang: string) => ["movies", "popular", page, lang],
  trending: (period: "day" | "week", lang: string) => [
    "movies",
    "trending",
    period,
    lang,
  ],

  // Detail
  movieDetail: (id: number, lang: string) => ["movie", id, "detail", lang],
  movieCredits: (id: number) => ["movie", id, "credits"],
  movieVideos: (id: number) => ["movie", id, "videos"],
  movieSimilar: (id: number, lang: string) => ["movie", id, "similar", lang],
  movieRecommendations: (id: number, lang: string) => [
    "movie",
    id,
    "recommendations",
    lang,
  ],
  movieWatchProviders: (id: number) => ["movie", id, "watch-providers"],
  movieReviews: (id: number) => ["movie", id, "reviews"],

  // Search
  search: (query: string, page: number, lang: string) => [
    "search",
    query,
    page,
    lang,
  ],

  // Genres
  genres: (lang: string) => ["genres", lang],

  // Person
  personDetail: (id: number) => ["person", id, "detail"],
  personMovies: (id: number, lang: string) => ["person", id, "movies", lang],

  // Collection
  collection: (id: number, lang: string) => ["collection", id, lang],

  // Discover
  discover: (params: Record<string, unknown>) => ["discover", params],
} as const;
