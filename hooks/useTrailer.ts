import { QUERY_KEYS } from "@/lib/queryClient";
import { extractTrailerKey, getMovieVideos } from "@/services/movies.service";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const useTrailer = (movieId: number) => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoQuery = useQuery({
    queryKey: QUERY_KEYS.movieVideos(movieId),
    queryFn: () => getMovieVideos(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60,
    select: (data) => extractTrailerKey(data),
  });

  const openTrailer = useCallback(() => {
    if (videoQuery.data) setIsPlayerVisible(true);
  }, [videoQuery.data]);

  const closeTrailer = useCallback(() => {
    setIsPlayerVisible(false);
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return {
    trailerKey: videoQuery.data || null,
    hasTrailer: !!videoQuery.data,
    isLoading: videoQuery.isLoading,
    isPlayerVisible,
    isFullscreen,
    openTrailer,
    closeTrailer,
    toggleFullscreen,
  };
};
