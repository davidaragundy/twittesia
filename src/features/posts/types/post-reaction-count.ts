// One row of the feed's reaction lookup, as the database returns it
export type PostReactionCount = {
  postId: string;
  emoji: string;
  count: number;
  isMine: boolean;
};
