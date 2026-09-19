import type { QueryClient } from "@tanstack/react-query";

import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import { POST_QUERY_KEY } from "@/features/posts/constants/post-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import { removeFeedPost } from "@/features/posts/utils/remove-feed-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
}

// Takes a post out of every order the reader has loaded, and forgets its own page
export const removeCachedPost = ({ queryClient, postId }: Props) => {
  queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
    removeFeedPost({ feed, postId }),
  );
  queryClient.removeQueries({ queryKey: [POST_QUERY_KEY, postId] });
};
