import { QUERY_KEYS } from "@/lib/queryClient";
import {
  getCollection,
  getCollectionMeta,
  getCollectionMoviesSorted,
  getCollectionStats,
  getFeaturedCollections,
} from "@/services/collection.service";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

// ─── Single collection ────────────────────────────────────────
export const useCollection = (collectionId: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.collection(collectionId, tmdbLang),
    queryFn: () => getCollection(collectionId, tmdbLang),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 60,
    select: (data) => ({
      ...data,
      sortedParts: getCollectionMoviesSorted(data),
      meta: getCollectionMeta(collectionId),
      stats: getCollectionStats(data),
    }),
  });
};

// ─── All featured collections ─────────────────────────────────
export const useFeaturedCollections = () => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: ["collections", "featured", tmdbLang],
    queryFn: () => getFeaturedCollections(tmdbLang),
    staleTime: 1000 * 60 * 60 * 6,
  });
};
