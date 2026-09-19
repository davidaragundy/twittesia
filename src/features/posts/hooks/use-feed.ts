import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { fetchFeedPage } from "@/features/posts/utils/fetch-feed-page";
import { toFeedQueryKey } from "@/features/posts/utils/to-feed-query-key";

interface Props {
  // Rendered on the server, so the feed is there on the first paint
  initialPage: FeedPage;
  // An identity, when the feed is one person's posts rather than everyone's
  authorId?: string;
}

export const useFeed = ({ initialPage, authorId }: Props) => {
  const [sort, setSort] = useState<FeedSort>(DEFAULT_FEED_SORT);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: toFeedQueryKey({ sort, authorId }),
      queryFn: ({ pageParam }) => fetchFeedPage({ cursor: pageParam, sort, authorId }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage: FeedPage) => lastPage.nextCursor,
      // Only the order the server rendered starts with a page; another is read when it is asked for
      initialData:
        sort === DEFAULT_FEED_SORT ? { pages: [initialPage], pageParams: [null] } : undefined,
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

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    posts,
    postIds: posts.map((post) => post.id),
    sort,
    setSort,
    isPending,
    isError: !!error,
    hasNextPage,
    isFetchingNextPage,
    endRef,
  };
};
