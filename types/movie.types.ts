import {
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "./api.types";

export interface Movie {
  id: number;
  title?: string; // Movies have title
  name?: string; // TV Shows have name
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string; // Movies
  first_air_date?: string; // TV Shows
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
  media_type?: "movie" | "tv" | "person";
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  budget?: number; // Only Movies
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue?: number; // Only Movies
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled"
    | "Ended"
    | "Returning Series"; // Added TV statuses
  tagline: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  // TV specific
  number_of_episodes?: number;
  number_of_seasons?: number;
  last_air_date?: string;
  next_episode_to_air?: any;
  external_ids?: {
    imdb_id?: string | null;
    freebase_mid?: string | null;
    freebase_id?: string | null;
    tvdb_id?: number | null;
    tvrage_id?: number | null;
    wikidata_id?: string | null;
    facebook_id?: string | null;
    instagram_id?: string | null;
    twitter_id?: string | null;
  };
}

export interface MovieReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// ─── DiscoverParams with all TMDB filter keys ─────────────────
export interface DiscoverParams {
  page?: number;
  language?: string;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  with_original_language?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  "popularity.gte"?: number;
  "popularity.lte"?: number;
  region?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  include_adult?: boolean;
  include_video?: boolean;
  watch_region?: string;
  with_watch_providers?: string;
}
