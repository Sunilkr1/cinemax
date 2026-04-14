export const TMDB = {
  BASE_URL:
    process.env.EXPO_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY || "",
  TOKEN: process.env.EXPO_PUBLIC_TMDB_TOKEN || "",
  IMAGE_BASE:
    process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p",
} as const;

// Image sizes from TMDB docs
export const IMAGE_SIZES = {
  poster: {
    tiny: "w92",
    small: "w154",
    medium: "w185",
    large: "w342",
    xl: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
  logo: {
    small: "w45",
    medium: "w92",
    large: "w154",
    original: "original",
  },
} as const;

// All TMDB API endpoints
export const ENDPOINTS = {
  // Movies
  NOW_PLAYING: "/movie/now_playing",
  UPCOMING: "/movie/upcoming",
  TOP_RATED: "/movie/top_rated",
  POPULAR: "/movie/popular",
  TRENDING_DAY: "/trending/movie/day",
  TRENDING_WEEK: "/trending/movie/week",

  // TV Shows
  TV_TRENDING_DAY: "/trending/tv/day",
  TV_TRENDING_WEEK: "/trending/tv/week",
  TV_TOP_RATED: "/tv/top_rated",
  TV_POPULAR: "/tv/popular",
  TV_AIRING_TODAY: "/tv/airing_today",
  TV_ON_THE_AIR: "/tv/on_the_air",

  // Movie detail
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
  MOVIE_CREDITS: (id: number) => `/movie/${id}/credits`,
  MOVIE_VIDEOS: (id: number) => `/movie/${id}/videos`,
  MOVIE_IMAGES: (id: number) => `/movie/${id}/images`,
  MOVIE_SIMILAR: (id: number) => `/movie/${id}/similar`,
  MOVIE_RECOMMENDATIONS: (id: number) => `/movie/${id}/recommendations`,
  MOVIE_WATCH_PROVIDERS: (id: number) => `/movie/${id}/watch/providers`,
  MOVIE_REVIEWS: (id: number) => `/movie/${id}/reviews`,
  MOVIE_KEYWORDS: (id: number) => `/movie/${id}/keywords`,

  // TV Detail
  TV_DETAIL: (id: number) => `/tv/${id}`,
  TV_CREDITS: (id: number) => `/tv/${id}/credits`,
  TV_VIDEOS: (id: number) => `/tv/${id}/videos`,
  TV_IMAGES: (id: number) => `/tv/${id}/images`,
  TV_SIMILAR: (id: number) => `/tv/${id}/similar`,
  TV_RECOMMENDATIONS: (id: number) => `/tv/${id}/recommendations`,
  TV_WATCH_PROVIDERS: (id: number) => `/tv/${id}/watch/providers`,
  TV_REVIEWS: (id: number) => `/tv/${id}/reviews`,
  TV_KEYWORDS: (id: number) => `/tv/${id}/keywords`,
  TV_EPISODE_GROUPS: (id: number) => `/tv/${id}/episode_groups`,
  TV_EXTERNAL_IDS: (id: number) => `/tv/${id}/external_ids`,

  // Search
  SEARCH_MOVIE: "/search/movie",
  SEARCH_TV: "/search/tv",
  SEARCH_PERSON: "/search/person",
  SEARCH_MULTI: "/search/multi",

  // Genres
  GENRE_LIST: "/genre/movie/list",
  TV_GENRE_LIST: "/genre/tv/list",

  // Collections
  COLLECTION: (id: number) => `/collection/${id}`,

  // Person / Cast
  PERSON_DETAIL: (id: number) => `/person/${id}`,
  PERSON_MOVIES: (id: number) => `/person/${id}/movie_credits`,
  PERSON_IMAGES: (id: number) => `/person/${id}/images`,

  // Discover
  DISCOVER: "/discover/movie",
  DISCOVER_TV: "/discover/tv",
} as const;

// Default query params
export const DEFAULT_PARAMS = {
  language: "en-US",
  page: 1,
  region: "IN",
} as const;

// Supported languages
export const LANGUAGES = {
  en: { code: "en-US", label: "English", flag: "🇺🇸" },
  hi: { code: "hi-IN", label: "Hindi", flag: "🇮🇳" },
} as const;

// Watch providers for India
export const WATCH_PROVIDERS = {
  8: { name: "Netflix", color: "#E50914" },
  119: { name: "Prime Video", color: "#00A8E1" },
  122: { name: "Hotstar", color: "#1F80E0" },
  337: { name: "Disney+", color: "#113CCF" },
  11: { name: "MUBI", color: "#000000" },
  350: { name: "Apple TV+", color: "#555555" },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
