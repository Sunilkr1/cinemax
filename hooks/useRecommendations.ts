import { QUERY_KEYS } from "@/lib/queryClient";
import { Storage } from "@/lib/storage";
import {
  fetchAIRecommendations,
  fetchMoodMovies,
  isAICacheFresh,
} from "@/services/ai.service";
import { getMovieRecommendations } from "@/services/movies.service";
import { Movie } from "@/types/movie.types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useLanguage } from "./useLanguage";

// ─── TMDB similar recommendations ────────────────────────────
export const useMovieRecommendations = (movieId: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.movieRecommendations(movieId, tmdbLang),
    queryFn: () => getMovieRecommendations(movieId, 1, tmdbLang),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30,
    select: (data) => data.results.slice(0, 10),
  });
};

// ─── AI recommendations ───────────────────────────────────────
export const useAIRecommendations = () => {
  const { tmdbLang } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    // If cache is fresh, try to load from storage first
    if (isAICacheFresh()) {
      const stored = Storage.getJSON<any>("ai_recommendation_history");
      if (stored?.movies?.length) {
        // We need to fetch real movie objects from IDs if we only stored IDs
        // For simplicity in this fix, we'll allow fetch to run if state is empty
        if (movies.length > 0) return;
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const { tmdbMovies } = await fetchAIRecommendations(tmdbLang);
      setMovies(tmdbMovies);
    } catch {
      setError("Could not load AI recommendations");
    } finally {
      setIsLoading(false);
    }
  }, [tmdbLang, movies.length]);

  return { movies, isLoading, error, fetch };
};

// ─── Mood-based movies ────────────────────────────────────────
export const useMoodMovies = () => {
  const { tmdbLang } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByMood = useCallback(
    async (moodText: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchMoodMovies(moodText, tmdbLang);
        setMovies(result.movies);
        setDescription(result.description);
      } catch {
        setError("Could not load mood movies");
      } finally {
        setIsLoading(false);
      }
    },
    [tmdbLang],
  );

  return { movies, description, isLoading, error, fetchByMood };
};
