import { Movie } from "./movie.types";

export interface TMDBCollection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface CollectionListItem {
  id: number;
  name: string;
  emoji: string;
  color: string;
  description: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}
