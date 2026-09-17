import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createPost } from "@/features/posts/actions/create-post";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { prependFeedPost } from "@/features/posts/utils/prepend-feed-post";

interface Props {
  form: UseFormReturn<CreatePostFormValues>;
}

export const useCreatePostMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: ({ data: created, error }) => {
      if (error) {
        toast.error("Couldn't publish your post", { description: error.message });
        return;
      }

      // The new post leads whichever order is on screen, so it is there the moment it is written;
      // where popularity really places it arrives with the next read
      queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
        prependFeedPost({ feed, post: created as FeedPost }),
      );

      form.reset({ content: "" });
    },
    onError: () => {
      toast.error("Couldn't publish your post", { description: "Please try again in a moment." });
    },
  });
};
