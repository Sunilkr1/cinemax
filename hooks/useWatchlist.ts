import {
  scheduleMovieReleaseNotification,
  showWatchlistTestNotification,
} from "@/lib/notifications";
import {
  addToWatchlist,
  clearWatchlist,
  isInWatchlist,
  loadWatchlist,
  removeFromWatchlist,
  sortWatchlist,
  subscribeToWatchlist,
  toggleWatchlist,
  WatchlistSortBy,
} from "@/store/watchlist.store";
import { Movie } from "@/types/movie.types";
import { useCallback, useState, useSyncExternalStore } from "react";

export const useWatchlist = () => {
  const items = useSyncExternalStore(subscribeToWatchlist, loadWatchlist);
  const [sortBy, setSortBy] = useState<WatchlistSortBy>("date_added_desc");

  const add = useCallback((movie: Movie) => {
    addToWatchlist(movie);
  }, []);

  const remove = useCallback((movieId: number) => {
    removeFromWatchlist(movieId);
  }, []);

  const toggle = useCallback((movie: Movie): boolean => {
    const { added } = toggleWatchlist(movie);

    // Notifications trigger if added
    if (added) {
      showWatchlistTestNotification(movie.title || movie.name || "Content");
      if (movie.release_date) {
        scheduleMovieReleaseNotification(
          movie.title || movie.name || "Content",
          movie.release_date,
          movie.id,
        );
      }
    }

    return added;
  }, []);

  const isAdded = useCallback((movieId: number) => isInWatchlist(movieId), []);

  const clear = useCallback(() => {
    clearWatchlist();
  }, []);

  const changeSortBy = useCallback((sort: WatchlistSortBy) => {
    setSortBy(sort);
  }, []);

  const sortedItems = sortWatchlist(items, sortBy);

  return {
    items: sortedItems,
    count: items.length,
    sortBy,
    add,
    remove,
    toggle,
    isAdded,
    clear,
    changeSortBy,
    isEmpty: items.length === 0,
  };
};
