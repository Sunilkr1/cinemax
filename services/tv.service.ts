import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import {
  TMDBResponse,
  TMDBVideosResponse
} from "@/types/api.types";
import {
  DiscoverParams,
  Movie as TVShow, // Reusing Movie type structure for simplicity, but aliasing as TVShow
  MovieDetail as TVShowDetail
} from "@/types/movie.types";

/**
 * TV service provides methods for interacting with TMDB TV-specific endpoints.
 * Note: Many data structures are shared with movies, so we reuse those types.
 */

// ─── Trending TV ──────────────────────────────────────────────
export const getTrendingTV = async (
  period: "day" | "week" = "day",
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  const endpoint =
    period === "day" ? ENDPOINTS.TV_TRENDING_DAY : ENDPOINTS.TV_TRENDING_WEEK;
  return get<TMDBResponse<TVShow>>(endpoint, { language });
};

// ─── Popular TV ───────────────────────────────────────────────
export const getPopularTV = async (
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.TV_POPULAR, {
    page,
    language,
  });
};

// ─── Top Rated TV ─────────────────────────────────────────────
export const getTopRatedTV = async (
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.TV_TOP_RATED, {
    page,
    language,
  });
};

// ─── Upcoming TV (Airing Today) ───────────────────────────────
export const getUpcomingTV = async (
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.TV_AIRING_TODAY, {
    page,
    language,
  });
};

// ─── TV Detail ────────────────────────────────────────────────
export const getTVDetail = async (
  id: number,
  language = "en-US",
): Promise<TVShowDetail> => {
  return get<TVShowDetail>(ENDPOINTS.TV_DETAIL(id), {
    language,
    append_to_response:
      "videos,credits,similar,recommendations,watch/providers,reviews,keywords,images,episode_groups,external_ids",
  });
};

// ─── TV Videos (Trailers/Clips) ───────────────────────────────
export const getTVVideos = async (
  id: number,
  language = "en-US",
): Promise<TMDBVideosResponse> => {
  return get<TMDBVideosResponse>(ENDPOINTS.TV_VIDEOS(id), { language });
};

// ─── TV Similar / Recommendations ─────────────────────────────
export const getTVSimilar = async (
  id: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.TV_SIMILAR(id), {
    page,
    language,
  });
};

export const getTVRecommendations = async (
  id: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.TV_RECOMMENDATIONS(id), {
    page,
    language,
  });
};

// ─── Discover TV (filter) ─────────────────────────────────────
export const discoverTV = async (
  params: DiscoverParams,
): Promise<TMDBResponse<TVShow>> => {
  return get<TMDBResponse<TVShow>>(ENDPOINTS.DISCOVER_TV, {
    sort_by: "popularity.desc",
    include_adult: false,
    ...params,
  });
};

// ─── TV Genres ────────────────────────────────────────────────
export const getTVByGenre = async (
  genreId: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow>> => {
  return discoverTV({
    with_genres: String(genreId ?? ""),
    page,
    language,
  });
};

// ─── K-Drama (South Korea TV) ─────────────────────────────────
export const getKDramas = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  return discoverTV({
    with_original_language: "ko",
    with_genres: "18", // Drama genre
    page,
  });
};

// ─── Anime (Japan TV/Animation) ────────────────────────────────
export const getAnimes = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  return discoverTV({
    with_original_language: "ja",
    with_genres: "16", // Animation genre
    page,
  });
};

// ─── Multi Search (Universal) ─────────────────────────────────
export const multiSearch = async (
  query: string,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<TVShow | any>> => {
  return get<TMDBResponse<TVShow | any>>(ENDPOINTS.SEARCH_MULTI, {
    query,
    page,
    language,
    include_adult: false,
  });
};
