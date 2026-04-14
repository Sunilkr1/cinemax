import {
  AIRecommendationRequest,
  AIRecommendedMovie,
  getAIRecommendations,
  getMoodMovieSuggestion,
} from "@/lib/ai";
import { Storage } from "@/lib/storage";
import { Movie } from "@/types/movie.types";
import { discoverMovies } from "./movies.service";
import { searchMovies } from "./search.service";

const AI_HISTORY_KEY = "ai_recommendation_history";
const AI_WATCH_HISTORY_KEY = "ai_watch_history";

// ─── Get AI recommendations ───────────────────────────────────
export const fetchAIRecommendations = async (
  language = "en-US",
): Promise<{ aiMovies: AIRecommendedMovie[]; tmdbMovies: Movie[] }> => {
  // Get watch history from storage
  const watchHistory = Storage.getJSON<string[]>(AI_WATCH_HISTORY_KEY) || [];

  const request: AIRecommendationRequest = {
    watchedMovies: watchHistory.slice(0, 20),
    favoriteGenres: getTopGenresFromHistory(),
    language,
  };

  // Get AI suggestions
  const aiMovies = await getAIRecommendations(request);

  // Search each recommended movie on TMDB
  const tmdbPromises = aiMovies.slice(0, 6).map(async (rec) => {
    const results = await searchMovies(`${rec.title} ${rec.year}`, 1, language);
    return results.results[0] || null;
  });

  const tmdbResults = await Promise.allSettled(tmdbPromises);
  let tmdbMovies = tmdbResults
    .filter(
      (r): r is PromiseFulfilledResult<Movie> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value);

  // If no specific movies found, fallback to trending curated discover
  if (tmdbMovies.length === 0) {
    const discoverResults = await discoverMovies({
      with_genres: "28,12,18", // Action, Adventure, Drama
      sort_by: "popularity.desc",
      language,
      page: 1,
    });
    tmdbMovies = discoverResults.results.slice(0, 6);
  }

  // Cache results
  Storage.setJSON(AI_HISTORY_KEY, {
    timestamp: Date.now(),
    movies: tmdbMovies.map((m) => m.id),
  });

  return { aiMovies, tmdbMovies };
};

// ─── Mood-based movie search ──────────────────────────────────
export const fetchMoodMovies = async (
  moodText: string,
  language = "en-US",
): Promise<{ description: string; movies: Movie[] }> => {
  const moodData = await getMoodMovieSuggestion(moodText);

  const movies = await discoverMovies({
    with_genres: moodData.genres.join(","),
    sort_by: "popularity.desc",
    language,
    page: 1,
  });

  return {
    description: moodData.description,
    movies: movies.results.slice(0, 10),
  };
};

// ─── Add to watch history ─────────────────────────────────────
export const addToWatchHistory = (movieTitle: string): void => {
  const history = Storage.getJSON<string[]>(AI_WATCH_HISTORY_KEY) || [];
  const updated = [
    movieTitle,
    ...history.filter((h) => h !== movieTitle),
  ].slice(0, 50);
  Storage.setJSON(AI_WATCH_HISTORY_KEY, updated);
};

// ─── Get watch history ────────────────────────────────────────
export const getWatchHistory = (): string[] => {
  return Storage.getJSON<string[]>(AI_WATCH_HISTORY_KEY) || [];
};

// ─── Clear AI cache ───────────────────────────────────────────
export const clearAICache = (): void => {
  Storage.delete(AI_HISTORY_KEY);
};

// ─── Internal: top genres from history ───────────────────────
const getTopGenresFromHistory = (): string[] => {
  // Static fallback — will be dynamic in hooks
  return ["Action", "Drama", "Thriller", "Sci-Fi"];
};

// ─── Check if AI cache is fresh (< 6 hours) ──────────────────
export const isAICacheFresh = (): boolean => {
  const cache = Storage.getJSON<{ timestamp: number }>(AI_HISTORY_KEY);
  if (!cache) return false;
  const sixHours = 6 * 60 * 60 * 1000;
  return Date.now() - cache.timestamp < sixHours;
};
