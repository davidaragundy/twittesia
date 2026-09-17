import "server-only";

import { sql } from "drizzle-orm";

import { comment, commentReaction } from "@/shared/lib/drizzle/schema";

// What popularity means for a comment: the reactions it drew
export const commentScoreSql = sql<number>`(
  select count(*)::int from ${commentReaction} where ${commentReaction.commentId} = ${comment.id}
)`;
