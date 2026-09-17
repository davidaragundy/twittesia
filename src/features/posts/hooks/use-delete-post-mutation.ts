import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreQueries } from "@/shared/utils/restore-queries";

import { deletePost } from "@/features/posts/actions/delete-post";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import { POST_QUERY_KEY } from "@/features/posts/constants/post-query-key";
import type { FeedData } from "@/features/posts/types/feed-data";
import { removeFeedPost } from "@/features/posts/utils/remove-feed-post";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    // The post leaves every order at once and comes back if the server refuses
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: FEED_QUERY_KEY });

      const previous = queryClient.getQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY });

      queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
        removeFeedPost({ feed, postId }),
      );

      return { previous };
    },
    onSuccess: ({ error }, postId, context) => {
      // A post that is already gone stays out of the list; anything else is put back
      if (!error || error.code === "POST_NOT_FOUND") {
        queryClient.removeQueries({ queryKey: [POST_QUERY_KEY, postId] });
        return;
      }

      restoreQueries({ queryClient, queries: context?.previous });
      toast.error("Couldn't delete your post", { description: error.message });
    },
    onError: (_error, _postId, context) => {
      restoreQueries({ queryClient, queries: context?.previous });
      toast.error("Couldn't delete your post", { description: "Please try again in a moment." });
    },
  });
};
