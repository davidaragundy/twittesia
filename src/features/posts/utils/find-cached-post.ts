import type { QueryClient } from "@tanstack/react-query";

import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import { POST_QUERY_KEY } from "@/features/posts/constants/post-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { findFeedPost } from "@/features/posts/utils/find-feed-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
}

// The post's own page first, then the feed
export const findCachedPost = ({ queryClient, postId }: Props): FeedPost | undefined =>
  queryClient.getQueryData<FeedPost>([POST_QUERY_KEY, postId]) ??
  findFeedPost({ feed: queryClient.getQueryData<FeedData>(FEED_QUERY_KEY), postId });
