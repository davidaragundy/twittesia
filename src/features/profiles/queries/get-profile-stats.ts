import "server-only";

import { eq, sql } from "drizzle-orm";

import {
  comment,
  commentReaction,
  commentView,
  post,
  postReaction,
  postView,
  user,
} from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { ProfileStats } from "@/features/profiles/types/profile-stats";

interface Props {
  userId: string;
}

// What one person has alive right now. Expiry is applied here rather than trusted to the purge,
// so nothing past its lifespan is counted, whenever the expired rows are actually deleted.
export const getProfileStats = async ({
  userId,
}: Props): Promise<ActionResponse<ProfileStats, "FAILED_TO_LOAD_STATS">> => {
  const livePosts = sql`select ${post.id} from ${post} where ${post.userId} = ${userId} and ${post.expiresAt} > now()`;
  const liveComments = sql`
    select ${comment.id} from ${comment}
    join ${post} on ${post.id} = ${comment.postId}
    where ${comment.userId} = ${userId} and ${post.expiresAt} > now()
  `;

  const { data, error } = await tryCatch(
    db
      .select({
        postCount: sql<number>`(select count(*)::int from (${livePosts}) as live_posts)`,
        commentCount: sql<number>`(select count(*)::int from (${liveComments}) as live_comments)`,
        reactionCount: sql<number>`(
          (select count(*)::int from ${postReaction} where ${postReaction.postId} in (${livePosts}))
          + (select count(*)::int from ${commentReaction} where ${commentReaction.commentId} in (${liveComments}))
        )`,
        viewCount: sql<number>`(
          (select count(*)::int from ${postView} where ${postView.postId} in (${livePosts}))
          + (select count(*)::int from ${commentView} where ${commentView.commentId} in (${liveComments}))
        )`,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1),
  );

  if (error || !data[0]) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_STATS", message: "Couldn't load the profile's counts" },
    };
  }

  return { data: data[0], error: null };
};
