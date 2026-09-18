import "server-only";

import { del } from "@vercel/blob";
import { and, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";

import { media } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { MEDIA_SWEEP_BATCH_SIZE } from "@/features/media/constants/media-sweep-batch-size";
import { MEDIA_SWEEP_MAX_BATCHES } from "@/features/media/constants/media-sweep-max-batches";
import { PENDING_MEDIA_GRACE_MS } from "@/features/media/constants/pending-media-grace-ms";

/**
 * Deletes from Blob every file that has nothing left to belong to, then forgets it.
 *
 * Owners are set to null rather than cascading, so whatever removed a post or a comment — its
 * author, its expiry, an identity leaving — leaves its files here, and this one sweep is the only
 * code that deletes them. An upload that was never attached counts too, once it is older than its
 * grace. Deleting is free on Blob and idempotent, so a duplicated or missed run costs nothing.
 */
export const sweepOrphanedMedia = async (): Promise<
  ActionResponse<{ deleted: number; hasMore: boolean }, "FAILED_TO_SWEEP_MEDIA">
> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_SWEEP_MEDIA" as const, message: "Couldn't delete the unused files" },
  };

  let deleted = 0;

  for (let batch = 0; batch < MEDIA_SWEEP_MAX_BATCHES; batch++) {
    const { data: rows, error } = await tryCatch(
      db
        .select({ id: media.id, pathname: media.pathname })
        .from(media)
        .where(
          and(
            isNull(media.postId),
            isNull(media.commentId),
            or(
              isNotNull(media.attachedAt),
              lt(media.createdAt, new Date(Date.now() - PENDING_MEDIA_GRACE_MS)),
            ),
          ),
        )
        .limit(MEDIA_SWEEP_BATCH_SIZE),
    );

    if (error) return failure;

    if (!rows.length) return { data: { deleted, hasMore: false }, error: null };

    // The files first: a row forgotten before its file is gone would leave the file for good
    const { error: deleteError } = await tryCatch(del(rows.map((row) => row.pathname)));

    if (deleteError) return failure;

    const { error: forgetError } = await tryCatch(
      db.delete(media).where(
        inArray(
          media.id,
          rows.map((row) => row.id),
        ),
      ),
    );

    if (forgetError) return failure;

    deleted += rows.length;

    if (rows.length < MEDIA_SWEEP_BATCH_SIZE)
      return { data: { deleted, hasMore: false }, error: null };
  }

  return { data: { deleted, hasMore: true }, error: null };
};
