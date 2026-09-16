import type { QueryClient } from "@tanstack/react-query";

import type { TogglePostReactionInput } from "@/features/posts/types/toggle-post-reaction-input";
import { setFeedPostReaction } from "@/features/posts/utils/set-feed-post-reaction";
import { updateCachedPost } from "@/features/posts/utils/update-cached-post";

interface Props {
  queryClient: QueryClient;
  input: TogglePostReactionInput;
  isMine: boolean;
}

export const setCachedPostReaction = ({ queryClient, input, isMine }: Props) =>
  updateCachedPost({
    queryClient,
    postId: input.postId,
    update: (post) => setFeedPostReaction({ post, emoji: input.emoji, isMine }),
  });
