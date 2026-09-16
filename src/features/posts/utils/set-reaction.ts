import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  emoji: string;
  isMine: boolean;
}

// Sets rather than toggles, so applying the same state twice changes nothing. A new emoji goes
// last, where the server will put it, since reactions are ordered by when each was first added.
export const setReaction = ({ reactions, emoji, isMine }: Props): Reaction[] => {
  const current = reactions.find((item) => item.emoji === emoji);

  if ((current?.isMine ?? false) === isMine) return reactions;

  const count = (current?.count ?? 0) + (isMine ? 1 : -1);

  if (!current) return [...reactions, { emoji, count, isMine }];

  return count > 0
    ? reactions.map((item) => (item.emoji === emoji ? { emoji, count, isMine } : item))
    : reactions.filter((item) => item.emoji !== emoji);
};
