import "server-only";

import { and, lte, notExists, eq, sql } from "drizzle-orm";

import { post, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { IDENTITY_LIFESPAN_SECONDS } from "@/features/auth/constants/identity-lifespan-seconds";
import { PURGE_BATCH_SIZE } from "@/features/auth/constants/purge-batch-size";
import { PURGE_MAX_BATCHES } from "@/features/auth/constants/purge-max-batches";

/**
 * Deletes identities that reached the end of their lifespan, in batches.
 *
 * An identity stops working 24 hours after it was created, because that is how long its session
 * lasts. The row is only removed once its last post has gone too: a post written in the identity's
 * final hour still has a full day of its own to live, and deleting the author would cascade that
 * post away early and break the profile behind every ghost-free post still on screen. So an
 * identity lingers, unusable, until it has nothing left — at most a day past its own expiry.
 *
 * Run this after the post purge, so posts that expired this run are already gone.
 *
 * Deleting what has expired is idempotent, so a duplicated or missed run costs nothing: the next
 * one catches up.
 */
export const purgeExpiredIdentities = async (): Promise<
  ActionResponse<{ deleted: number; hasMore: boolean }, "FAILED_TO_PURGE_IDENTITIES">
> => {
  let deleted = 0;

  for (let batch = 0; batch < PURGE_MAX_BATCHES; batch++) {
    const expiredAt = new Date(Date.now() - IDENTITY_LIFESPAN_SECONDS * 1000);

    const { data, error } = await tryCatch(
      db
        .delete(user)
        .where(
          sql`${user.id} in ${db
            .select({ id: user.id })
            .from(user)
            .where(
              and(
                lte(user.createdAt, expiredAt),
                notExists(db.select({ id: post.id }).from(post).where(eq(post.userId, user.id))),
              ),
            )
            .limit(PURGE_BATCH_SIZE)}`,
        )
        .returning({ id: user.id }),
    );

    if (error) {
      return {
        data: null,
        error: {
          code: "FAILED_TO_PURGE_IDENTITIES",
          message: "Couldn't delete the expired identities",
        },
      };
    }

    deleted += data.length;

    if (data.length < PURGE_BATCH_SIZE) return { data: { deleted, hasMore: false }, error: null };
  }

  return { data: { deleted, hasMore: true }, error: null };
};
