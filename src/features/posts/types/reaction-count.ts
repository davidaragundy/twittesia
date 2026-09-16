// One row of a reaction lookup, as the database returns it, for a post or a comment
export type ReactionCount = {
  targetId: string;
  emoji: string;
  count: number;
  isMine: boolean;
};
