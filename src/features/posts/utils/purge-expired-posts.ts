import "server-only";

import { lte, sql } from "drizzle-orm";

import { post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { PURGE_BATCH_SIZE } from "@/features/posts/constants/purge-batch-size";
import { PURGE_MAX_BATCHES } from "@/features/posts/constants/purge-max-batches";

// Deletes posts that reached the end of their lifespan, in batches. Deleting what has expired is
// idempotent, so a duplicated or missed run costs nothing: the next one catches up.
export const purgeExpiredPosts = async (): Promise<
  ActionResponse<{ deleted: number; hasMore: boolean }, "FAILED_TO_PURGE_POSTS">
> => {
  let deleted = 0;

  for (let batch = 0; batch < PURGE_MAX_BATCHES; batch++) {
    const { data, error } = await tryCatch(
      db
        .delete(post)
        .where(
          sql`${post.id} in ${db
            .select({ id: post.id })
            .from(post)
            .where(lte(post.expiresAt, new Date()))
            .limit(PURGE_BATCH_SIZE)}`,
        )
        .returning({ id: post.id }),
    );

    if (error) {
      return {
        data: null,
        error: { code: "FAILED_TO_PURGE_POSTS", message: "Couldn't delete the expired posts" },
      };
    }

    deleted += data.length;

    if (data.length < PURGE_BATCH_SIZE) return { data: { deleted, hasMore: false }, error: null };
  }

  return { data: { deleted, hasMore: true }, error: null };
};
