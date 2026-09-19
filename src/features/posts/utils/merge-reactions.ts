import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  // What the reader's page shows, which knows which emoji are theirs
  current: Reaction[];
  // What the store holds now, in the order each emoji was first added
  counts: { emoji: string; count: number }[];
}

// Takes the counts from an event and keeps the reader's own emoji as their page knows them: who
// reacted is never sent, and the reader's own reaction is already right there
export const mergeReactions = ({ current, counts }: Props): Reaction[] =>
  counts.map(({ emoji, count }) => ({
    emoji,
    count,
    isMine: current.some((item) => item.emoji === emoji && item.isMine),
  }));
