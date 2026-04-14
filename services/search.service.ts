import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import { Storage, STORAGE_KEYS } from "@/lib/storage";
import { TMDBResponse } from "@/types/api.types";
import { Movie } from "@/types/movie.types";

// ─── Search movies ────────────────────────────────────────────
export const searchMovies = async (
  query: string,
  page = 1,
  language = "en-US",
  region = "IN",
): Promise<TMDBResponse<Movie>> => {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  return get<TMDBResponse<Movie>>(ENDPOINTS.SEARCH_MOVIE, {
    query: query.trim(),
    page,
    language,
    region,
    include_adult: false,
  });
};

// ─── Search with year filter ──────────────────────────────────
export const searchMoviesFiltered = async (
  query: string,
  options: {
    page?: number;
    language?: string;
    year?: number;
    region?: string;
  } = {},
): Promise<TMDBResponse<Movie>> => {
  const { page = 1, language = "en-US", year, region = "IN" } = options;

  return get<TMDBResponse<Movie>>(ENDPOINTS.SEARCH_MOVIE, {
    query: query.trim(),
    page,
    language,
    region,
    include_adult: false,
    ...(year ? { year } : {}),
  });
};

// ─── Multi search (movies + people) ──────────────────────────
export interface MultiSearchResult {
  id: number;
  media_type: "movie" | "person" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  release_date?: string;
  known_for_department?: string;
  popularity: number;
}

export const multiSearch = async (
  query: string,
  page = 1,
  language = "en-US",
): Promise<TMDBResponse<MultiSearchResult>> => {
  return get<TMDBResponse<MultiSearchResult>>(ENDPOINTS.SEARCH_MULTI, {
    query: query.trim(),
    page,
    language,
    include_adult: false,
  });
};

// ─── Search History — MMKV ────────────────────────────────────
const MAX_HISTORY = 15;

export const getSearchHistory = (): string[] => {
  return Storage.getJSON<string[]>(STORAGE_KEYS.SEARCH_HISTORY) || [];
};

export const addToSearchHistory = (query: string): void => {
  if (!query.trim()) return;
  const history = getSearchHistory();
  const filtered = history.filter(
    (h) => h.toLowerCase() !== query.toLowerCase(),
  );
  const updated = [query.trim(), ...filtered].slice(0, MAX_HISTORY);
  Storage.setJSON(STORAGE_KEYS.SEARCH_HISTORY, updated);
};

export const removeFromSearchHistory = (query: string): void => {
  const history = getSearchHistory();
  const updated = history.filter(
    (h) => h.toLowerCase() !== query.toLowerCase(),
  );
  Storage.setJSON(STORAGE_KEYS.SEARCH_HISTORY, updated);
};

export const clearSearchHistory = (): void => {
  Storage.delete(STORAGE_KEYS.SEARCH_HISTORY);
};

// ─── Genre filter helper ──────────────────────────────────────
export const filterByGenre = (
  movies: Movie[],
  genreId: number | null,
): Movie[] => {
  if (!genreId) return movies;
  return movies.filter((m) => m.genre_ids.includes(genreId));
};

// ─── Sort helper ──────────────────────────────────────────────
export type SortOption = "popularity" | "rating" | "release_date" | "title";

export const sortMovies = (movies: Movie[], sortBy: SortOption): Movie[] => {
  const sorted = [...movies];
  switch (sortBy) {
    case "popularity":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "rating":
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case "release_date":
      return sorted.sort(
        (a, b) =>
          new Date(b.release_date || b.first_air_date || 0).getTime() -
          new Date(a.release_date || a.first_air_date || 0).getTime(),
      );
    case "title":
      return sorted.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || ""),
      );
    default:
      return sorted;
  }
};
