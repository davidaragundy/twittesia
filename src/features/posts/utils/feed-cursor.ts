import type { FeedPost } from "@/features/posts/types/feed-post";

// A cursor points at the last post of a page: the feed orders by creation, and by id for the
// posts that share a moment
export const toFeedCursor = ({ createdAt, id }: Pick<FeedPost, "createdAt" | "id">) =>
  `${createdAt.toISOString()}_${id}`;

export const parseFeedCursor = (cursor: string | null | undefined) => {
  if (!cursor) return null;

  const [createdAt, ...rest] = cursor.split("_");
  const id = rest.join("_");
  const createdAtDate = createdAt ? new Date(createdAt) : null;

  if (!id || !createdAtDate || Number.isNaN(createdAtDate.getTime())) return null;

  return { createdAt: createdAtDate, id };
};
