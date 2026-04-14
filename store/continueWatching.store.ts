import { Storage, STORAGE_KEYS } from "@/lib/storage";
import { ContinueWatchingItem } from "@/types/watchlist.types";

const MAX_ITEMS = 10;

// ─── Load continue watching list ─────────────────────────────
export const loadContinueWatching = (): ContinueWatchingItem[] => {
  return (
    Storage.getJSON<ContinueWatchingItem[]>(STORAGE_KEYS.CONTINUE_WATCHING) ||
    []
  );
};

// ─── Save list ────────────────────────────────────────────────
const saveContinueWatching = (items: ContinueWatchingItem[]): void => {
  Storage.setJSON(STORAGE_KEYS.CONTINUE_WATCHING, items);
};

// ─── Update scroll position ───────────────────────────────────
export const updateScrollPosition = (
  movieId: number,
  title: string,
  poster_path: string | null,
  scrollPosition: number,
): ContinueWatchingItem[] => {
  const current = loadContinueWatching();

  const existing = current.find((i) => i.movieId === movieId);
  const updatedItem: ContinueWatchingItem = {
    movieId,
    title,
    poster_path,
    scrollPosition,
    lastWatched: Date.now(),
  };

  let updated: ContinueWatchingItem[];
  if (existing) {
    updated = current.map((i) => (i.movieId === movieId ? updatedItem : i));
  } else {
    updated = [updatedItem, ...current].slice(0, MAX_ITEMS);
  }

  saveContinueWatching(updated);
  return updated;
};

// ─── Get scroll position for movie ───────────────────────────
export const getScrollPosition = (movieId: number): number => {
  const items = loadContinueWatching();
  return items.find((i) => i.movieId === movieId)?.scrollPosition || 0;
};

// ─── Remove item ──────────────────────────────────────────────
export const removeFromContinueWatching = (
  movieId: number,
): ContinueWatchingItem[] => {
  const updated = loadContinueWatching().filter((i) => i.movieId !== movieId);
  saveContinueWatching(updated);
  return updated;
};

// ─── Clear all ────────────────────────────────────────────────
export const clearContinueWatching = (): void => {
  Storage.delete(STORAGE_KEYS.CONTINUE_WATCHING);
};
