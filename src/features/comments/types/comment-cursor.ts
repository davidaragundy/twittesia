export type CommentCursor = {
  // The comment's score, only when its post's comments are read by popularity
  score: number | null;
  createdAt: Date;
  id: string;
};
