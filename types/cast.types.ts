// Cast member in a movie
export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  order: number;
  popularity: number;
  known_for_department: string;
  gender: number;
  credit_id: string;
  cast_id: number;
  adult: boolean;
}

// Crew member
export interface CrewMember {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
  credit_id: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
}

// Full credits response
export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// Person detail
export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  also_known_as: string[];
  adult: boolean;
}

// Person movie credits
export interface PersonMovieCredit {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  character?: string;
  job?: string;
  department?: string;
  popularity: number;
  overview: string;
}

export interface PersonMovieCredits {
  id: number;
  cast: PersonMovieCredit[];
  crew: PersonMovieCredit[];
}
