export type FeedCursor = {
  // The post's score, only when the feed is read by popularity
  score: number | null;
  createdAt: Date;
  id: string;
};
