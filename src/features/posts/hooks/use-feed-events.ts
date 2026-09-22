import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useRealtime } from "@/features/posts/lib/realtime-client";
import { findCachedPost } from "@/features/posts/utils/find-cached-post";
import { removeCachedPost } from "@/features/posts/utils/remove-cached-post";
import { setCachedPostCommentCount } from "@/features/posts/utils/set-cached-post-comment-count";
import { setCachedPostReactions } from "@/features/posts/utils/set-cached-post-reactions";

interface Props {
  // The reader, so their own writing never arrives as news
  viewerId?: string | null;
  // One person's feed only offers that person's posts
  authorId?: string;
}

/**
 * Keeps an open feed in step with what everyone else is doing: posts appear as an offer rather
 * than jumping into the list under the reader's eyes, and a post that has gone leaves at once.
 *
 * Reactions arrive as the whole set of emoji and their counts, so a page that missed an event
 * still lands on what the store holds.
 *
 * New posts are kept by id rather than counted: the channel replays what a page missed when it
 * reconnects, so the same post can arrive twice, or arrive when it is already on screen, and a
 * post can be deleted before anyone asks to see it.
 */
export const useFeedEvents = ({ viewerId, authorId }: Props) => {
  const queryClient = useQueryClient();
  const [newPostIds, setNewPostIds] = useState<ReadonlySet<string>>(new Set());

  useRealtime({
    events: ["content.posted", "content.commented", "content.removed", "content.reacted"],
    onData({ event, data }) {
      if (data.authorId === viewerId) return;

      if (event === "content.posted") {
        if (authorId && data.authorId !== authorId) return;
        if (findCachedPost({ queryClient, postId: data.id })) return;

        setNewPostIds((ids) => (ids.has(data.id) ? ids : new Set(ids).add(data.id)));
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
        if (data.type === "post") {
          removeCachedPost({ queryClient, postId: data.id });
          setNewPostIds((ids) => {
            if (!ids.has(data.id)) return ids;

            const next = new Set(ids);

            next.delete(data.id);
            return next;
          });
        }

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

  return { newPostCount: newPostIds.size, forgetNewPosts: () => setNewPostIds(new Set()) };
};
