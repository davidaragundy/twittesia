import "server-only";

import { BlobNotFoundError, head } from "@vercel/blob";
import { and, eq, gt, inArray, isNull } from "drizzle-orm";

import { media } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import { PENDING_MEDIA_GRACE_MS } from "@/features/media/constants/pending-media-grace-ms";
import type { ConfirmedMedia } from "@/features/media/types/confirmed-media";
import type { MediaKind } from "@/features/media/types/media-kind";
import type { MediaUpload } from "@/features/media/types/media-upload";

interface Props {
  uploads: MediaUpload[];
  userId: string;
}

/**
 * Checks every upload the browser asks to attach against what is actually stored.
 *
 * Each one must be an upload this identity was authorised for, still unattached and younger than
 * the sweep's grace, so the sweep can never delete a file out from under it. Then the store is
 * asked, with head(), whether the file arrived, and what type and size it really is: the browser's
 * word counts for nothing past this point.
 */
export const confirmMediaUploads = async ({
  uploads,
  userId,
}: Props): Promise<
  ActionResponse<ConfirmedMedia[], "MEDIA_NOT_FOUND" | "INVALID_MEDIA" | "FAILED_TO_CONFIRM_MEDIA">
> => {
  if (!uploads.length) return { data: [], error: null };

  const pathnames = uploads.map((upload) => upload.pathname);

  if (new Set(pathnames).size !== pathnames.length) {
    return { data: null, error: { code: "INVALID_MEDIA", message: "A file was attached twice" } };
  }

  const { data: rows, error } = await tryCatch(
    db
      .select({ id: media.id, pathname: media.pathname, kind: media.kind })
      .from(media)
      .where(
        and(
          inArray(media.pathname, pathnames),
          eq(media.userId, userId),
          isNull(media.postId),
          isNull(media.commentId),
          isNull(media.attachedAt),
          gt(media.createdAt, new Date(Date.now() - PENDING_MEDIA_GRACE_MS)),
        ),
      ),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_CONFIRM_MEDIA", message: "Couldn't check your files" },
    };
  }

  if (rows.length !== uploads.length) {
    return {
      data: null,
      error: { code: "MEDIA_NOT_FOUND", message: "One of your files didn't finish uploading" },
    };
  }

  const { data: blobs, error: headError } = await tryCatch(
    Promise.all(pathnames.map((pathname) => head(pathname))),
  );

  if (headError) {
    return headError instanceof BlobNotFoundError
      ? {
          data: null,
          error: { code: "MEDIA_NOT_FOUND", message: "One of your files didn't finish uploading" },
        }
      : {
          data: null,
          error: { code: "FAILED_TO_CONFIRM_MEDIA", message: "Couldn't check your files" },
        };
  }

  const confirmed: ConfirmedMedia[] = [];

  for (const [position, upload] of uploads.entries()) {
    const row = rows.find((item) => item.pathname === upload.pathname);
    const blob = blobs[position];
    const kind = row?.kind as MediaKind | undefined;

    if (
      !row ||
      !blob ||
      !kind ||
      !MEDIA_RULES[kind].contentTypes.includes(blob.contentType) ||
      blob.size > MEDIA_RULES[kind].maxBytes
    ) {
      return {
        data: null,
        error: { code: "INVALID_MEDIA", message: "One of your files isn't one that can be shared" },
      };
    }

    confirmed.push({
      id: row.id,
      kind,
      url: blob.url,
      contentType: blob.contentType,
      width: kind === "audio" ? null : upload.width,
      height: kind === "audio" ? null : upload.height,
      pathname: row.pathname,
      size: blob.size,
      position,
    });
  }

  return { data: confirmed, error: null };
};
