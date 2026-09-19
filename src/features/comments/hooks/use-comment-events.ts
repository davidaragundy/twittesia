import { useQueryClient } from "@tanstack/react-query";

import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import { removeCachedComment } from "@/features/comments/utils/remove-cached-comment";
import { setCachedCommentCount } from "@/features/comments/utils/set-cached-comment-count";
import { setCachedCommentReactions } from "@/features/comments/utils/set-cached-comment-reactions";
import { useRealtime } from "@/features/posts/lib/realtime-client";
import { setCachedPostReactions } from "@/features/posts/utils/set-cached-post-reactions";

interface Props {
  postId: string;
  // The reader, so their own writing never arrives as news
  viewerId?: string | null;
}

/**
 * Keeps an open post in step with what everyone else is doing: a new comment is read rather than
 * sent, so the page shows exactly what the store holds, in whichever order the reader is on.
 *
 * Only what touches this post is acted on; everything else passing the one channel is ignored.
 */
export const useCommentEvents = ({ postId, viewerId }: Props) => {
  const queryClient = useQueryClient();

  useRealtime({
    events: ["content.commented", "content.removed", "content.reacted"],
    onData({ event, data }) {
      if (data.authorId === viewerId) return;

      if (event === "content.commented") {
        if (data.postId !== postId) return;

        setCachedCommentCount({ queryClient, postId, commentCount: data.commentCount });
        queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY] });
        return;
      }

      if (event === "content.removed") {
        if (data.type !== "comment" || data.postId !== postId) return;

        removeCachedComment({ queryClient, commentId: data.id });

        if (data.commentCount !== null) {
          setCachedCommentCount({ queryClient, postId, commentCount: data.commentCount });
        }

        return;
      }

      if (data.type === "comment" && data.postId === postId) {
        setCachedCommentReactions({ queryClient, commentId: data.id, counts: data.reactions });
      }

      if (data.type === "post" && data.id === postId) {
        setCachedPostReactions({ queryClient, postId, counts: data.reactions });
      }
    },
  });
};
