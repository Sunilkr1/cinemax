import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import {
  CastMember,
  CrewMember,
  MovieCredits,
  PersonDetail,
  PersonMovieCredits,
} from "@/types/cast.types";

// ─── Movie Credits (cast + crew) ──────────────────────────────
export const getMovieCredits = async (
  movieId: number,
): Promise<MovieCredits> => {
  return get<MovieCredits>(ENDPOINTS.MOVIE_CREDITS(movieId));
};

// ─── Person Detail ────────────────────────────────────────────
export const getPersonDetail = async (
  personId: number,
  language = "en-US",
): Promise<PersonDetail> => {
  return get<PersonDetail>(ENDPOINTS.PERSON_DETAIL(personId), { language });
};

// ─── Person Movie Credits ─────────────────────────────────────
export const getPersonMovieCredits = async (
  personId: number,
  language = "en-US",
): Promise<PersonMovieCredits> => {
  return get<PersonMovieCredits>(ENDPOINTS.PERSON_MOVIES(personId), {
    language,
  });
};

// ─── Get top N cast members ───────────────────────────────────
export const getTopCast = (credits: MovieCredits, limit = 10): CastMember[] => {
  return credits.cast.sort((a, b) => a.order - b.order).slice(0, limit);
};

// ─── Get director from crew ───────────────────────────────────
export const getDirector = (credits: MovieCredits): CrewMember | undefined => {
  return credits.crew.find((c) => c.job === "Director");
};

// ─── Get key crew members ─────────────────────────────────────
export interface KeyCrew {
  director?: CrewMember;
  writer?: CrewMember;
  producer?: CrewMember;
  cinematographer?: CrewMember;
  composer?: CrewMember;
}

export const getKeyCrew = (credits: MovieCredits): KeyCrew => {
  const crew = credits.crew;

  return {
    director: crew.find((c) => c.job === "Director"),
    writer: crew.find(
      (c) => c.job === "Screenplay" || c.job === "Writer" || c.job === "Story",
    ),
    producer: crew.find((c) => c.job === "Producer"),
    cinematographer: crew.find((c) => c.job === "Director of Photography"),
    composer: crew.find((c) => c.job === "Original Music Composer"),
  };
};

// ─── Get person age ───────────────────────────────────────────
export const getPersonAge = (person: PersonDetail): number | null => {
  if (!person.birthday) return null;
  const birthDate = new Date(person.birthday);
  const endDate = person.deathday ? new Date(person.deathday) : new Date();
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const m = endDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ─── Get person gender label ──────────────────────────────────
export const getGenderLabel = (gender: number): string => {
  switch (gender) {
    case 1:
      return "Female";
    case 2:
      return "Male";
    case 3:
      return "Non-binary";
    default:
      return "Not specified";
  }
};

// ─── Get sorted filmography ───────────────────────────────────
export const getSortedFilmography = (
  credits: PersonMovieCredits,
  limit = 20,
) => {
  const allMovies = [...credits.cast, ...credits.crew];

  // Deduplicate by id
  const unique = allMovies.filter(
    (m, index, self) => index === self.findIndex((t) => t.id === m.id),
  );

  return unique
    .filter((m) => m.poster_path && m.release_date)
    .sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
    )
    .slice(0, limit);
};
