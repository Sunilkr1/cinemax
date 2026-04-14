import { QUERY_KEYS } from "@/lib/queryClient";
import {
  addToSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  multiSearch,
  removeFromSearchHistory,
} from "@/services/search.service";
import { debounce } from "@/utils/debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useLanguage } from "./useLanguage";

export const useSearch = () => {
  const { tmdbLang } = useLanguage();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [history, setHistory] = useState<string[]>(getSearchHistory);

  // Debounce 300ms — any[] signature avoids type mismatch
  const debouncedSet = useRef(
    debounce((...args: any[]) => {
      setDebouncedQuery(args[0] as string);
    }, 300),
  ).current;

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      debouncedSet(text);
    },
    [debouncedSet],
  );

  const searchQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.search(debouncedQuery, 1, tmdbLang),
    queryFn: ({ pageParam = 1 }) =>
      multiSearch(debouncedQuery, pageParam as number, tmdbLang),
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialPageParam: 1,
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
  });

  const submitSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    addToSearchHistory(q.trim());
    setHistory(getSearchHistory());
    setQuery(q.trim());
    setDebouncedQuery(q.trim());
  }, []);

  const removeHistory = useCallback((q: string) => {
    removeFromSearchHistory(q);
    setHistory(getSearchHistory());
  }, []);

  const clearHistory = useCallback(() => {
    clearSearchHistory();
    setHistory([]);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const results = searchQuery.data?.pages.flatMap((p) => p.results) || [];

  return {
    query,
    debouncedQuery,
    results,
    history,
    isLoading: searchQuery.isLoading,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
    hasNextPage: searchQuery.hasNextPage,
    fetchNextPage: searchQuery.fetchNextPage,
    handleQueryChange,
    submitSearch,
    removeHistory,
    clearHistory,
    clearSearch,
    isEmpty:
      debouncedQuery.length >= 2 &&
      results.length === 0 &&
      !searchQuery.isLoading,
    showHistory: query.trim().length === 0,
  };
};
