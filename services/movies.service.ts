import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import {
  TMDBResponse,
  TMDBVideosResponse,
  TMDBWatchProvidersResponse,
} from "@/types/api.types";
import {
  DiscoverParams,
  Movie,
  MovieDetail,
  MovieReview,
} from "@/types/movie.types";

// ─── Now Playing ──────────────────────────────────────────────
export const getNowPlaying = async (
  page = 1,
  language = "en-US",
  region = "IN",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.NOW_PLAYING, {
    page,
    language,
    region,
  });
};

// ─── Upcoming ─────────────────────────────────────────────────
export const getUpcoming = async (
  page = 1,
  language = "en-US",
  region = "IN",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.UPCOMING, {
    page,
    language,
    region,
  });
};

// ─── Top Rated ────────────────────────────────────────────────
export const getTopRated = async (
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.TOP_RATED, {
    page,
    language,
  });
};

// ─── Popular ──────────────────────────────────────────────────
export const getPopular = async (
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.POPULAR, {
    page,
    language,
  });
};

// ─── Trending ─────────────────────────────────────────────────
export const getTrending = async (
  period: "day" | "week" = "day",
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  const endpoint =
    period === "day" ? ENDPOINTS.TRENDING_DAY : ENDPOINTS.TRENDING_WEEK;
  return get<TMDBResponse<Movie>>(endpoint, { language });
};

// ─── Movie Detail ─────────────────────────────────────────────
export const getMovieDetail = async (
  id: number,
  language = "en-US",
): Promise<MovieDetail> => {
  return get<MovieDetail>(ENDPOINTS.MOVIE_DETAIL(id), {
    language,
    append_to_response:
      "videos,credits,similar,recommendations,watch/providers,reviews,keywords,images",
  });
};

// ─── Movie Videos (Trailers) ──────────────────────────────────
export const getMovieVideos = async (
  id: number,
  language = "en-US",
): Promise<TMDBVideosResponse> => {
  return get<TMDBVideosResponse>(ENDPOINTS.MOVIE_VIDEOS(id), { language });
};

// ─── Movie Similar ────────────────────────────────────────────
export const getMovieSimilar = async (
  id: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.MOVIE_SIMILAR(id), {
    page,
    language,
  });
};

// ─── Movie Recommendations ────────────────────────────────────
export const getMovieRecommendations = async (
  id: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.MOVIE_RECOMMENDATIONS(id), {
    page,
    language,
  });
};

// ─── Watch Providers ──────────────────────────────────────────
export const getWatchProviders = async (
  id: number,
): Promise<TMDBWatchProvidersResponse> => {
  return get<TMDBWatchProvidersResponse>(ENDPOINTS.MOVIE_WATCH_PROVIDERS(id));
};

// ─── Movie Reviews ────────────────────────────────────────────
export const getMovieReviews = async (
  id: number,
  page = 1,
): Promise<TMDBResponse<MovieReview>> => {
  return get<TMDBResponse<MovieReview>>(ENDPOINTS.MOVIE_REVIEWS(id), { page });
};

// ─── Discover (filter) ────────────────────────────────────────
export const discoverMovies = async (
  params: DiscoverParams,
): Promise<TMDBResponse<Movie>> => {
  return get<TMDBResponse<Movie>>(ENDPOINTS.DISCOVER, {
    sort_by: "popularity.desc",
    include_adult: false,
    include_video: false,
    ...params,
  });
};

// ─── Discover by Genre ────────────────────────────────────────
export const getMoviesByGenre = async (
  genreId: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return discoverMovies({
    with_genres: String(genreId ?? ""),
    page,
    language,
  });
};

// ─── Discover by Year ─────────────────────────────────────────
export const getMoviesByYear = async (
  year: number,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<Movie>> => {
  return discoverMovies({
    primary_release_year: year,
    page,
    language,
  });
};

// ─── Discover by Language ─────────────────────────────────────
export const getMoviesByLanguage = async (
  langCode: string,
  page = 1,
): Promise<TMDBResponse<Movie>> => {
  return discoverMovies({
    with_original_language: langCode,
    page,
  });
};

// ─── Bollywood (Hindi) ────────────────────────────────────────
export const getBollywoodMovies = async (
  page = 1,
): Promise<TMDBResponse<Movie>> => {
  return discoverMovies({
    with_original_language: "hi",
    region: "IN",
    page,
    language: "hi-IN",
  });
};

// ─── Extract official YouTube trailer ────────────────────────
export const extractTrailerKey = (
  videos: TMDBVideosResponse,
): string | null => {
  const results = videos?.results || [];

  // Priority: Official Trailer on YouTube
  const officialTrailer = results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official === true,
  );
  if (officialTrailer) return officialTrailer.key;

  // Fallback: Any trailer on YouTube
  const anyTrailer = results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );
  if (anyTrailer) return anyTrailer.key;

  // Fallback: Teaser
  const teaser = results.find(
    (v) => v.site === "YouTube" && v.type === "Teaser",
  );
  if (teaser) return teaser.key;

  // Last resort: any YouTube video
  const anyYT = results.find((v) => v.site === "YouTube");
  return anyYT?.key || null;
};

// ─── Extract India watch providers ───────────────────────────
export const extractIndiaProviders = (data: TMDBWatchProvidersResponse) => {
  return data?.results?.IN || null;
};

// ─── Top 10 (popular slice) ───────────────────────────────────
export const getTop10 = async (language = "en-US"): Promise<Movie[]> => {
  const response = await getTrending("week", language);
  return response.results.slice(0, 10);
};
