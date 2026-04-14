import { useCallback, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  threshold?: number; // 0-1, default 0.8
}

export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  threshold = 0.8,
}: UseInfiniteScrollOptions) => {
  const isLoadingRef = useRef(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      const scrolled =
        (contentOffset.y + layoutMeasurement.height) / contentSize.height;

      if (
        scrolled > threshold &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingRef.current
      ) {
        isLoadingRef.current = true;
        fetchNextPage();
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 500);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, threshold],
  );

  // For FlatList onEndReached
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { handleScroll, onEndReached };
};
