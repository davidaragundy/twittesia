import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useRealtime } from "@/features/posts/lib/realtime-client";
import { removeCachedPost } from "@/features/posts/utils/remove-cached-post";
import { setCachedPostCommentCount } from "@/features/posts/utils/set-cached-post-comment-count";
import { setCachedPostReactions } from "@/features/posts/utils/set-cached-post-reactions";

interface Props {
  // The reader, so their own writing never arrives as news
  viewerId?: string | null;
}

/**
 * Keeps an open feed in step with what everyone else is doing: posts appear as an offer rather
 * than jumping into the list under the reader's eyes, and a post that has gone leaves at once.
 *
 * Reactions arrive as the whole set of emoji and their counts, so a page that missed an event
 * still lands on what the store holds.
 */
export const useFeedEvents = ({ viewerId }: Props) => {
  const queryClient = useQueryClient();
  const [newPostCount, setNewPostCount] = useState(0);

  useRealtime({
    events: ["content.posted", "content.commented", "content.removed", "content.reacted"],
    onData({ event, data }) {
      if (data.authorId === viewerId) return;

      if (event === "content.posted") {
        setNewPostCount((count) => count + 1);
        return;
      }

      if (event === "content.commented") {
        setCachedPostCommentCount({
          queryClient,
          postId: data.postId,
          commentCount: data.commentCount,
        });
        return;
      }

      if (event === "content.removed") {
        if (data.type === "post") removeCachedPost({ queryClient, postId: data.id });

        // A comment leaving changes the count of the post it was on, which the feed shows
        if (data.type === "comment" && data.postId && data.commentCount !== null) {
          setCachedPostCommentCount({
            queryClient,
            postId: data.postId,
            commentCount: data.commentCount,
          });
        }

        return;
      }

      if (data.type === "post") {
        setCachedPostReactions({ queryClient, postId: data.id, counts: data.reactions });
      }
    },
  });

  return { newPostCount, forgetNewPosts: () => setNewPostCount(0) };
};
