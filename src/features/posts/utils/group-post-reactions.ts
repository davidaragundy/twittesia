import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";
import type { PostReactionCount } from "@/features/posts/types/post-reaction-count";
import { isPostReactionKey } from "@/features/posts/utils/is-post-reaction-key";
import { sortPostReactions } from "@/features/posts/utils/sort-post-reactions";

interface Props {
  counts: PostReactionCount[];
}

// Keys dropped from the set since a row was written are left out
export const groupPostReactions = ({ counts }: Props): Map<string, FeedPostReaction[]> => {
  const grouped = new Map<string, FeedPostReaction[]>();

  for (const { postId, reaction, count, isMine } of counts) {
    if (!isPostReactionKey(reaction)) continue;

    grouped.set(postId, [...(grouped.get(postId) ?? []), { reaction, count, isMine }]);
  }

  for (const [postId, reactions] of grouped) grouped.set(postId, sortPostReactions(reactions));

  return grouped;
};
