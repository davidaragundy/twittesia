import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import { useFeedEvents } from "@/features/posts/hooks/use-feed-events";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { fetchFeedPage } from "@/features/posts/utils/fetch-feed-page";
import { toFeedQueryKey } from "@/features/posts/utils/to-feed-query-key";

interface Props {
  // Rendered on the server, so the feed is there on the first paint
  initialPage: FeedPage;
  // An identity, when the feed is one person's posts rather than everyone's
  authorId?: string;
  // The order the first page was read in, for a feed that doesn't start with the usual one
  initialSort?: FeedSort;
  // The reader, so their own posts never arrive as news
  viewerId?: string | null;
}

export const useFeed = ({
  initialPage,
  authorId,
  initialSort = DEFAULT_FEED_SORT,
  viewerId,
}: Props) => {
  const [sort, setSort] = useState<FeedSort>(initialSort);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, refetch } =
    useInfiniteQuery({
      queryKey: toFeedQueryKey({ sort, authorId }),
      queryFn: ({ pageParam }) => fetchFeedPage({ cursor: pageParam, sort, authorId }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage: FeedPage) => lastPage.nextCursor,
      // Only the order the server rendered starts with a page; another is read when it is asked for
      initialData: sort === initialSort ? { pages: [initialPage], pageParams: [null] } : undefined,
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

  const { newPostCount, forgetNewPosts } = useFeedEvents({ viewerId, authorId });

  // Read again from the top, and taken there: only this feed, in the order it is in
  const showNewPosts = () => {
    forgetNewPosts();
    void refetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    posts,
    // New posts go at the top of the latest ones; in any other order they would land elsewhere
    newPostCount: sort === "latest" ? newPostCount : 0,
    showNewPosts,
    postIds: posts.map((post) => post.id),
    sort,
    setSort,
    isPending,
    // An order only means something with two things to put in it; while one is loading, the
    // menu that asked for it stays
    canSort: isPending || posts.length > 1 || !!hasNextPage,
    isError: !!error,
    hasNextPage,
    isFetchingNextPage,
    endRef,
  };
};
