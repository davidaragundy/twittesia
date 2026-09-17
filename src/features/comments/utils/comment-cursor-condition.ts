import "server-only";

import { lt, sql } from "drizzle-orm";

import { comment } from "@/shared/lib/drizzle/schema";

import type { CommentCursor } from "@/features/comments/types/comment-cursor";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import { commentScoreSql } from "@/features/comments/utils/comment-score-sql";

interface Props {
  after: CommentCursor | null;
  sort: CommentSort;
}

// Everything the order places after the cursor, compared as a row so the tie-breakers travel with
// the column they break the tie for
export const commentCursorCondition = ({ after, sort }: Props) => {
  if (!after) return undefined;

  if (sort === "popular") {
    return lt(
      sql`(${commentScoreSql}, ${comment.createdAt}, ${comment.id})`,
      sql`(${after.score}, ${after.createdAt}, ${after.id})`,
    );
  }

  return lt(sql`(${comment.createdAt}, ${comment.id})`, sql`(${after.createdAt}, ${after.id})`);
};
