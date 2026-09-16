import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { togglePostReaction } from "@/features/posts/actions/toggle-post-reaction";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { TogglePostReactionInput } from "@/features/posts/types/toggle-post-reaction-input";
import { findFeedPost } from "@/features/posts/utils/find-feed-post";
import { removeFeedPost } from "@/features/posts/utils/remove-feed-post";
import { setCachedPostReaction } from "@/features/posts/utils/set-cached-post-reaction";

export const useTogglePostReactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostReaction,
    // Writes a state rather than restoring a snapshot, so toggles queued behind each other can't
    // overwrite one another's result
    onMutate: async (input: TogglePostReactionInput) => {
      await queryClient.cancelQueries({ queryKey: FEED_QUERY_KEY });

      const post = findFeedPost({
        feed: queryClient.getQueryData<FeedData>(FEED_QUERY_KEY),
        postId: input.postId,
      });
      const isAdding = !post?.reactions.some(
        (item) => item.reaction === input.reaction && item.isMine,
      );

      setCachedPostReaction({ queryClient, input, isMine: isAdding });

      return { isAdding };
    },
    onSuccess: ({ data, error }, input, context) => {
      // A post that has expired or been deleted leaves the feed rather than staying unusable
      if (error?.code === "POST_NOT_FOUND") {
        queryClient.setQueryData<FeedData>(FEED_QUERY_KEY, (feed) =>
          removeFeedPost({ feed, postId: input.postId }),
        );
        toast.error("Couldn't save your reaction", { description: error.message });
        return;
      }

      if (error) {
        setCachedPostReaction({ queryClient, input, isMine: !context.isAdding });
        toast.error("Couldn't save your reaction", { description: error.message });
        return;
      }

      // The server toggled what it had, which differs only when this cache was out of date
      if (data.reacted !== context.isAdding) {
        setCachedPostReaction({ queryClient, input, isMine: data.reacted });
      }
    },
    onError: (_error, input, context) => {
      if (context) setCachedPostReaction({ queryClient, input, isMine: !context.isAdding });
      toast.error("Couldn't save your reaction", { description: "Please try again in a moment." });
    },
  });
};
