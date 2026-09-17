import "server-only";

import { lt, sql } from "drizzle-orm";

import { post } from "@/shared/lib/drizzle/schema";

import type { FeedCursor } from "@/features/posts/types/feed-cursor";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { postScoreSql } from "@/features/posts/utils/post-score-sql";

interface Props {
  after: FeedCursor | null;
  sort: FeedSort;
}

// Everything the order places after the cursor, compared as a row so the tie-breakers travel with
// the column they break the tie for
export const feedCursorCondition = ({ after, sort }: Props) => {
  if (!after) return undefined;

  if (sort === "popular") {
    return lt(
      sql`(${postScoreSql}, ${post.createdAt}, ${post.id})`,
      sql`(${after.score}, ${after.createdAt}, ${after.id})`,
    );
  }

  return lt(sql`(${post.createdAt}, ${post.id})`, sql`(${after.createdAt}, ${after.id})`);
};
