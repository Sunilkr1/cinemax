import { Storage, STORAGE_KEYS } from "@/lib/storage";
import { CustomList } from "@/types/watchlist.types";

// ─── Load all custom lists ────────────────────────────────────
export const loadCustomLists = (): CustomList[] => {
  return Storage.getJSON<CustomList[]>(STORAGE_KEYS.CUSTOM_LISTS) || [];
};

// ─── Save all custom lists ────────────────────────────────────
const saveCustomLists = (lists: CustomList[]): void => {
  Storage.setJSON(STORAGE_KEYS.CUSTOM_LISTS, lists);
};

// ─── Create new list ──────────────────────────────────────────
export const createCustomList = (
  name: string,
  emoji = "🎬",
  color = "#E50914",
): CustomList => {
  const lists = loadCustomLists();
  const newList: CustomList = {
    id: `list_${Date.now()}`,
    name,
    emoji,
    color,
    createdAt: Date.now(),
    movieIds: [],
  };
  saveCustomLists([...lists, newList]);
  return newList;
};

// ─── Delete list ──────────────────────────────────────────────
export const deleteCustomList = (listId: string): CustomList[] => {
  const lists = loadCustomLists();
  const updated = lists.filter((l) => l.id !== listId);
  saveCustomLists(updated);
  return updated;
};

// ─── Rename list ──────────────────────────────────────────────
export const renameCustomList = (
  listId: string,
  name: string,
): CustomList[] => {
  const lists = loadCustomLists();
  const updated = lists.map((l) => (l.id === listId ? { ...l, name } : l));
  saveCustomLists(updated);
  return updated;
};

// ─── Add movie to list ────────────────────────────────────────
export const addMovieToList = (
  listId: string,
  movieId: number,
): CustomList[] => {
  const lists = loadCustomLists();
  const updated = lists.map((l) => {
    if (l.id !== listId) return l;
    if (l.movieIds.includes(movieId)) return l;
    return { ...l, movieIds: [...l.movieIds, movieId] };
  });
  saveCustomLists(updated);
  return updated;
};

// ─── Remove movie from list ───────────────────────────────────
export const removeMovieFromList = (
  listId: string,
  movieId: number,
): CustomList[] => {
  const lists = loadCustomLists();
  const updated = lists.map((l) =>
    l.id === listId
      ? { ...l, movieIds: l.movieIds.filter((id) => id !== movieId) }
      : l,
  );
  saveCustomLists(updated);
  return updated;
};

// ─── Check if movie is in list ────────────────────────────────
export const isMovieInList = (listId: string, movieId: number): boolean => {
  const lists = loadCustomLists();
  const list = lists.find((l) => l.id === listId);
  return list?.movieIds.includes(movieId) || false;
};

// ─── Get list by ID ───────────────────────────────────────────
export const getListById = (listId: string): CustomList | null => {
  const lists = loadCustomLists();
  return lists.find((l) => l.id === listId) || null;
};

// ─── Get all lists that contain a movie ──────────────────────
export const getListsContaining = (movieId: number): CustomList[] => {
  return loadCustomLists().filter((l) => l.movieIds.includes(movieId));
};
