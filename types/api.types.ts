// Base TMDB API response wrapper
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Base image type
export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
  iso_639_1: string | null;
}

// Genre
export interface Genre {
  id: number;
  name: string;
}

// Production company
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Production country
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// Spoken language
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Video (trailer)
export interface TMDBVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: "YouTube" | "Vimeo";
  size: number;
  type:
    | "Trailer"
    | "Teaser"
    | "Clip"
    | "Featurette"
    | "Behind the Scenes"
    | "Bloopers";
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

// Watch provider
export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProvidersCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface TMDBWatchProvidersResponse {
  id: number;
  results: Record<string, WatchProvidersCountry>;
}

// Keyword
export interface Keyword {
  id: number;
  name: string;
}

export interface TMDBKeywordsResponse {
  id: number;
  keywords: Keyword[];
}
