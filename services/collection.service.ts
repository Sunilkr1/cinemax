import { COLLECTIONS } from "@/constants/collections";
import { ENDPOINTS } from "@/constants/tmdb";
import { get } from "@/lib/api";
import { TMDBCollection } from "@/types/collection.types";
import { Movie } from "@/types/movie.types";

// ─── Get single collection by ID ─────────────────────────────
export const getCollection = async (
  id: number,
  language = "en-US",
): Promise<TMDBCollection> => {
  return get<TMDBCollection>(ENDPOINTS.COLLECTION(id), { language });
};

// ─── Get multiple collections ─────────────────────────────────
export const getMultipleCollections = async (
  ids: number[],
  language = "en-US",
): Promise<TMDBCollection[]> => {
  const promises = ids.map((id) => getCollection(id, language));
  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (r): r is PromiseFulfilledResult<TMDBCollection> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value);
};

// ─── Get all featured collections ────────────────────────────
export const getFeaturedCollections = async (
  language = "en-US",
): Promise<TMDBCollection[]> => {
  const ids = COLLECTIONS.map((c) => c.id);
  return getMultipleCollections(ids, language);
};

// ─── Get collection movies sorted by release ─────────────────
export const getCollectionMoviesSorted = (
  collection: TMDBCollection,
): Movie[] => {
  return [...collection.parts]
    .filter((m) => m.release_date)
    .sort(
      (a, b) =>
        new Date(a.release_date || 0).getTime() -
        new Date(b.release_date || 0).getTime(),
    );
};

// ─── Get collection meta (from constants) ────────────────────
export const getCollectionMeta = (id: number) => {
  return COLLECTIONS.find((c) => c.id === id) || null;
};

// ─── Get collection total runtime ────────────────────────────
export const getCollectionStats = (collection: TMDBCollection) => {
  const totalMovies = collection.parts.length;
  const avgRating =
    collection.parts.reduce((sum, m) => sum + m.vote_average, 0) /
    (totalMovies || 1);
  const years = collection.parts
    .filter((m) => m.release_date)
    .map((m) => new Date(m.release_date || 0).getFullYear())
    .sort((a, b) => a - b);

  return {
    totalMovies,
    avgRating: parseFloat(avgRating.toFixed(1)),
    startYear: years[0] || null,
    endYear: years[years.length - 1] || null,
  };
};
