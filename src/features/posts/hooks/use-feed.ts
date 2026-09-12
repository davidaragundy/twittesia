import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedPage } from "@/features/posts/types/feed-page";
import { fetchFeedPage } from "@/features/posts/utils/fetch-feed-page";

interface Props {
  // Rendered on the server, so the feed is there on the first paint
  initialPage: FeedPage;
}

export const useFeed = ({ initialPage }: Props) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: FeedPage) => lastPage.nextCursor,
    initialData: { pages: [initialPage], pageParams: [null] },
  });

  // Loads the next page once the end of the list comes into view
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const end = endRef.current;

    if (!end || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) fetchNextPage();
    });

    observer.observe(end);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return {
    posts: data.pages.flatMap((page) => page.posts),
    isError: !!error,
    hasNextPage,
    isFetchingNextPage,
    endRef,
  };
};
