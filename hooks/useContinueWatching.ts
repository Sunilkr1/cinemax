import {
  clearContinueWatching,
  getScrollPosition,
  loadContinueWatching,
  removeFromContinueWatching,
  updateScrollPosition,
} from "@/store/continueWatching.store";
import { ContinueWatchingItem } from "@/types/watchlist.types";
import { useCallback, useState } from "react";

export const useContinueWatching = () => {
  const [items, setItems] =
    useState<ContinueWatchingItem[]>(loadContinueWatching);

  const updateScroll = useCallback(
    (
      movieId: number,
      title: string,
      poster_path: string | null,
      position: number,
    ) => {
      const updated = updateScrollPosition(
        movieId,
        title,
        poster_path,
        position,
      );
      setItems(updated);
    },
    [],
  );

  const remove = useCallback((movieId: number) => {
    const updated = removeFromContinueWatching(movieId);
    setItems(updated);
  }, []);

  const clear = useCallback(() => {
    clearContinueWatching();
    setItems([]);
  }, []);

  const getPosition = useCallback(
    (movieId: number) => getScrollPosition(movieId),
    [],
  );

  return {
    items,
    updateScroll,
    remove,
    clear,
    getPosition,
    isEmpty: items.length === 0,
  };
};
