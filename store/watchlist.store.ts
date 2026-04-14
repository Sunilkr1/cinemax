import { Storage, STORAGE_KEYS } from "@/lib/storage";
import { Movie } from "@/types/movie.types";
import { WatchlistItem } from "@/types/watchlist.types";

const listeners = new Set<() => void>();

export const subscribeToWatchlist = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

let cachedWatchlist: WatchlistItem[] | null = null;

// ─── Load all watchlist items ─────────────────────────────────
export const loadWatchlist = (): WatchlistItem[] => {
  if (cachedWatchlist) return cachedWatchlist;
  cachedWatchlist =
    Storage.getJSON<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST) || [];
  return cachedWatchlist;
};

// ─── Save full watchlist ──────────────────────────────────────
const saveWatchlist = (items: WatchlistItem[]): void => {
  cachedWatchlist = items;
  Storage.setJSON(STORAGE_KEYS.WATCHLIST, items);
  notifyListeners();
};

// ─── Add movie to watchlist ───────────────────────────────────
export const addToWatchlist = (movie: Movie): WatchlistItem[] => {
  const current = loadWatchlist();
  const exists = current.some((item) => item.movie.id === movie.id);
  if (exists) return current;

  const newItem: WatchlistItem = {
    movie,
    addedAt: Date.now(),
  };

  const updated = [newItem, ...current];
  saveWatchlist(updated);
  return updated;
};

// ─── Remove movie from watchlist ──────────────────────────────
export const removeFromWatchlist = (movieId: number): WatchlistItem[] => {
  const current = loadWatchlist();
  const updated = current.filter((item) => item.movie.id !== movieId);
  saveWatchlist(updated);
  return updated;
};

// ─── Toggle watchlist ─────────────────────────────────────────
export const toggleWatchlist = (
  movie: Movie,
): { items: WatchlistItem[]; added: boolean } => {
  const current = loadWatchlist();
  const exists = current.some((item) => item.movie.id === movie.id);

  if (exists) {
    return { items: removeFromWatchlist(movie.id), added: false };
  } else {
    return { items: addToWatchlist(movie), added: true };
  }
};

// ─── Check if in watchlist ────────────────────────────────────
export const isInWatchlist = (movieId: number): boolean => {
  const current = loadWatchlist();
  return current.some((item) => item.movie.id === movieId);
};

// ─── Sort watchlist ───────────────────────────────────────────
export type WatchlistSortBy =
  | "date_added_desc"
  | "date_added_asc"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "title_desc";

export const sortWatchlist = (
  items: WatchlistItem[],
  sortBy: WatchlistSortBy,
): WatchlistItem[] => {
  const sorted = [...items];
  switch (sortBy) {
    case "date_added_desc":
      return sorted.sort((a, b) => b.addedAt - a.addedAt);
    case "date_added_asc":
      return sorted.sort((a, b) => a.addedAt - b.addedAt);
    case "rating_desc":
      return sorted.sort((a, b) => b.movie.vote_average - a.movie.vote_average);
    case "rating_asc":
      return sorted.sort((a, b) => a.movie.vote_average - b.movie.vote_average);
    case "title_asc":
      return sorted.sort((a, b) =>
        (a.movie.title || a.movie.name || "").localeCompare(
          b.movie.title || b.movie.name || "",
        ),
      );
    case "title_desc":
      return sorted.sort((a, b) =>
        (b.movie.title || b.movie.name || "").localeCompare(
          a.movie.title || a.movie.name || "",
        ),
      );
    default:
      return sorted;
  }
};

// ─── Clear entire watchlist ───────────────────────────────────
export const clearWatchlist = (): void => {
  cachedWatchlist = [];
  Storage.delete(STORAGE_KEYS.WATCHLIST);
  notifyListeners();
};

// ─── Get watchlist count ──────────────────────────────────────
export const getWatchlistCount = (): number => {
  return loadWatchlist().length;
};
