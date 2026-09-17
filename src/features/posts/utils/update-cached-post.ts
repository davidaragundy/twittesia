import type { QueryClient } from "@tanstack/react-query";

import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import { POST_QUERY_KEY } from "@/features/posts/constants/post-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { updateFeedPost } from "@/features/posts/utils/update-feed-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
  update: (post: FeedPost) => FeedPost;
}

// Keeps every order of the feed and the post's own page in step, whichever of them is on screen
export const updateCachedPost = ({ queryClient, postId, update }: Props) => {
  queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
    updateFeedPost({ feed, postId, update }),
  );
  queryClient.setQueryData<FeedPost>([POST_QUERY_KEY, postId], (post) => post && update(post));
};
