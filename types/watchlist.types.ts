import { Movie } from "./movie.types";

export interface WatchlistItem {
  movie: Movie;
  addedAt: number; // timestamp
  listId?: string; // for custom lists
}

export interface CustomList {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: number;
  movieIds: number[];
}

export type WatchlistSortOption =
  | "date_added_desc"
  | "date_added_asc"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "title_desc";

export interface ContinueWatchingItem {
  movieId: number;
  scrollPosition: number;
  lastWatched: number;
  title: string;
  poster_path: string | null;
}
