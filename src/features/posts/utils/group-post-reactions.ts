import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";
import type { PostReactionCount } from "@/features/posts/types/post-reaction-count";

interface Props {
  // Already in the order each emoji was first added
  counts: PostReactionCount[];
}

export const groupPostReactions = ({ counts }: Props): Map<string, FeedPostReaction[]> => {
  const grouped = new Map<string, FeedPostReaction[]>();

  for (const { postId, emoji, count, isMine } of counts) {
    grouped.set(postId, [...(grouped.get(postId) ?? []), { emoji, count, isMine }]);
  }

  return grouped;
};
