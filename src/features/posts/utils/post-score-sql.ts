import "server-only";

import { sql } from "drizzle-orm";

import { comment, post, postReaction } from "@/shared/lib/drizzle/schema";

// What popularity means for a post: the reactions it drew, plus the comments it drew
export const postScoreSql = sql<number>`(
  (select count(*) from ${postReaction} where ${postReaction.postId} = ${post.id})
  + (select count(*) from ${comment} where ${comment.postId} = ${post.id})
)::int`;
