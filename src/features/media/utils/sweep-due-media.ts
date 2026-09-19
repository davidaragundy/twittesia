import "server-only";

import { del } from "@vercel/blob";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { BLOB_EXPIRY_KEY } from "@/features/media/constants/blob-expiry-key";
import { MEDIA_SWEEP_BATCH_SIZE } from "@/features/media/constants/media-sweep-batch-size";
import { MEDIA_SWEEP_MAX_BATCHES } from "@/features/media/constants/media-sweep-max-batches";

/**
 * Deletes from Blob every file that is due, then forgets it.
 *
 * Expiring keys notify nobody, so every file sits in one sorted set scored by when it must go:
 * its owner's expiry, the end of its grace while unattached, or now once its owner is deleted.
 * This sweep is the only code that deletes files. Deleting is free on Blob and idempotent, so a
 * duplicated or missed run costs nothing.
 */
export const sweepDueMedia = async (): Promise<
  ActionResponse<{ deleted: number; hasMore: boolean }, "FAILED_TO_SWEEP_MEDIA">
> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_SWEEP_MEDIA" as const, message: "Couldn't delete the unused files" },
  };

  let deleted = 0;

  for (let batch = 0; batch < MEDIA_SWEEP_MAX_BATCHES; batch++) {
    const { data: pathnames, error } = await tryCatch(
      redis.zrange<string[]>(BLOB_EXPIRY_KEY, "-inf", Date.now(), {
        byScore: true,
        offset: 0,
        count: MEDIA_SWEEP_BATCH_SIZE,
      }),
    );

    if (error) return failure;

    if (!pathnames.length) return { data: { deleted, hasMore: false }, error: null };

    // The files first: a path forgotten before its file is gone would leave the file for good
    const { error: deleteError } = await tryCatch(del(pathnames));

    if (deleteError) return failure;

    const { error: forgetError } = await tryCatch(redis.zrem(BLOB_EXPIRY_KEY, ...pathnames));

    if (forgetError) return failure;

    deleted += pathnames.length;

    if (pathnames.length < MEDIA_SWEEP_BATCH_SIZE) {
      return { data: { deleted, hasMore: false }, error: null };
    }
  }

  return { data: { deleted, hasMore: true }, error: null };
};
