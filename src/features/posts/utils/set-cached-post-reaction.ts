import type { QueryClient } from "@tanstack/react-query";

import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { TogglePostReactionInput } from "@/features/posts/types/toggle-post-reaction-input";
import { setFeedPostReaction } from "@/features/posts/utils/set-feed-post-reaction";
import { updateFeedPost } from "@/features/posts/utils/update-feed-post";

interface Props {
  queryClient: QueryClient;
  input: TogglePostReactionInput;
  isMine: boolean;
}

export const setCachedPostReaction = ({ queryClient, input, isMine }: Props) =>
  queryClient.setQueryData<FeedData>(FEED_QUERY_KEY, (feed) =>
    updateFeedPost({
      feed,
      postId: input.postId,
      update: (post) => setFeedPostReaction({ post, reaction: input.reaction, isMine }),
    }),
  );
