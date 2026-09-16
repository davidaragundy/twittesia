import type { Reaction } from "@/features/posts/types/reaction";
import type { ReactionCount } from "@/features/posts/types/reaction-count";

interface Props {
  // Already in the order each emoji was first added
  counts: ReactionCount[];
}

// Keyed by the post or comment the reactions belong to
export const groupReactions = ({ counts }: Props): Map<string, Reaction[]> => {
  const grouped = new Map<string, Reaction[]>();

  for (const { targetId, emoji, count, isMine } of counts) {
    grouped.set(targetId, [...(grouped.get(targetId) ?? []), { emoji, count, isMine }]);
  }

  return grouped;
};
