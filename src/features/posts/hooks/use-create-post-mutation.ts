import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createPost } from "@/features/posts/actions/create-post";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedPost } from "@/features/posts/types/feed-post";

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

      // The new post leads the feed without waiting for a refetch
      queryClient.setQueryData<InfiniteData<FeedPage, string | null>>(FEED_QUERY_KEY, (feed) =>
        feed
          ? {
              ...feed,
              pages: feed.pages.map((page, index) =>
                index === 0 ? { ...page, posts: [created as FeedPost, ...page.posts] } : page,
              ),
            }
          : feed,
      );

      form.reset({ content: "" });
    },
    onError: () => {
      toast.error("Couldn't publish your post", { description: "Please try again in a moment." });
    },
  });
};
