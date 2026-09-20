import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { generateId } from "@/shared/utils/generate-id";

import type { Session } from "@/features/auth/types/session";
import { createPost } from "@/features/posts/actions/create-post";
import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";
import type { CreatePostInput } from "@/features/posts/types/create-post-input";
import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { prependFeedPost } from "@/features/posts/utils/prepend-feed-post";
import { removeFeedPost } from "@/features/posts/utils/remove-feed-post";

interface Props {
  form: UseFormReturn<CreatePostFormValues>;
  // Who is writing, so the post can be shown as theirs before the store has heard of it
  user?: Session["user"];
  // Clears what the form doesn't hold, such as the files attached to it
  onPublished: () => void;
}

/**
 * Publishes a post, and shows it first.
 *
 * The post is on screen and the composer is empty the moment it is written; the store's answer
 * replaces it a moment later, or takes it away again and gives back what was typed. Until then it
 * is marked as on its way, so nothing offers to react to or delete something that may not exist.
 *
 * A post carrying files waits for the answer instead: where those files ended up is something
 * only the store knows, and half a post is worse than a moment of waiting.
 */
export const useCreatePostMutation = ({ form, user, onPublished }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onMutate: async (input: CreatePostInput) => {
      if (!user || input.media.length) return {};

      await queryClient.cancelQueries({ queryKey: FEED_QUERY_KEY });

      const pending: FeedPost = {
        id: generateId(),
        content: input.content,
        createdAt: new Date(),
        author: { name: user.name, username: user.username, displayUsername: user.username },
        isMine: true,
        isPending: true,
        reactions: [],
        media: [],
        viewCount: 0,
        commentCount: 0,
      };

      queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
        prependFeedPost({ feed, post: pending }),
      );

      form.reset({ content: "" });
      onPublished();

      return { pendingId: pending.id, content: input.content };
    },
    onSuccess: ({ data: created, error }, _input, context) => {
      const drop = (feed: FeedData | undefined) =>
        context?.pendingId ? removeFeedPost({ feed, postId: context.pendingId }) : feed;

      if (error) {
        queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, drop);
        form.setValue("content", context?.content ?? "", { shouldValidate: true });
        toast.error("Couldn't publish your post", { description: error.message });
        return;
      }

      // The post that was shown is replaced by the one that was saved, which is the only one the
      // rest of the app knows about
      queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
        prependFeedPost({ feed: drop(feed), post: created as FeedPost }),
      );
    },
    onError: (_error, _input, context) => {
      if (context?.pendingId) {
        queryClient.setQueriesData<FeedData>({ queryKey: FEED_QUERY_KEY }, (feed) =>
          removeFeedPost({ feed, postId: context.pendingId }),
        );
      }

      form.setValue("content", context?.content ?? "", { shouldValidate: true });
      toast.error("Couldn't publish your post", { description: "Please try again in a moment." });
    },
  });
};
