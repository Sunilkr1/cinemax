import {
  addMovieToList,
  createCustomList,
  deleteCustomList,
  getListsContaining,
  isMovieInList,
  loadCustomLists,
  removeMovieFromList,
  renameCustomList,
} from "@/store/customLists.store";
import { CustomList } from "@/types/watchlist.types";
import { useCallback, useState } from "react";

export const useCustomLists = () => {
  const [lists, setLists] = useState<CustomList[]>(loadCustomLists);

  const create = useCallback((name: string, emoji?: string, color?: string) => {
    const newList = createCustomList(name, emoji, color);
    setLists(loadCustomLists());
    return newList;
  }, []);

  const remove = useCallback((listId: string) => {
    const updated = deleteCustomList(listId);
    setLists(updated);
  }, []);

  const rename = useCallback((listId: string, name: string) => {
    const updated = renameCustomList(listId, name);
    setLists(updated);
  }, []);

  const addMovie = useCallback((listId: string, movieId: number) => {
    const updated = addMovieToList(listId, movieId);
    setLists(updated);
  }, []);

  const removeMovie = useCallback((listId: string, movieId: number) => {
    const updated = removeMovieFromList(listId, movieId);
    setLists(updated);
  }, []);

  const isInList = useCallback(
    (listId: string, movieId: number) => isMovieInList(listId, movieId),
    [],
  );

  const getContaining = useCallback(
    (movieId: number) => getListsContaining(movieId),
    [],
  );

  return {
    lists,
    create,
    remove,
    rename,
    addMovie,
    removeMovie,
    isInList,
    getContaining,
    isEmpty: lists.length === 0,
  };
};
