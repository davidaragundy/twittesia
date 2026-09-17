import type { FeedCursor } from "@/features/posts/types/feed-cursor";
import type { FeedSort } from "@/features/posts/types/feed-sort";

interface Props {
  cursor: string | null | undefined;
  sort: FeedSort;
}

// A cursor the reader sent back, which is only as trustworthy as anything else from the browser
export const parseFeedCursor = ({ cursor, sort }: Props): FeedCursor | null => {
  if (!cursor) return null;

  // An id holds underscores of its own, so only the parts before it are split off
  const parts = cursor.split("_");
  const score = sort === "popular" ? Number(parts.shift()) : null;
  const [createdAt, ...rest] = parts;
  const id = rest.join("_");
  const createdAtDate = createdAt ? new Date(createdAt) : null;

  if (!id || !createdAtDate || Number.isNaN(createdAtDate.getTime())) return null;
  if (score !== null && !Number.isInteger(score)) return null;

  return { score, createdAt: createdAtDate, id };
};
