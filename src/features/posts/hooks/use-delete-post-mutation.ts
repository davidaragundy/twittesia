import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePost } from "@/features/posts/actions/delete-post";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import { removeFeedPost } from "@/features/posts/utils/remove-feed-post";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    // The post leaves the feed at once and comes back if the server refuses
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: FEED_QUERY_KEY });

      const previous = queryClient.getQueryData<FeedData>(FEED_QUERY_KEY);

      queryClient.setQueryData<FeedData>(FEED_QUERY_KEY, (feed) =>
        removeFeedPost({ feed, postId }),
      );

      return { previous };
    },
    onSuccess: ({ error }, _postId, context) => {
      // A post that is already gone stays out of the list; anything else is put back
      if (!error || error.code === "POST_NOT_FOUND") return;

      queryClient.setQueryData(FEED_QUERY_KEY, context?.previous);
      toast.error("Couldn't delete your post", { description: error.message });
    },
    onError: (_error, _postId, context) => {
      queryClient.setQueryData(FEED_QUERY_KEY, context?.previous);
      toast.error("Couldn't delete your post", { description: "Please try again in a moment." });
    },
  });
};
