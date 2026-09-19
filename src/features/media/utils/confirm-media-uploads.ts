import "server-only";

import { BlobNotFoundError, head } from "@vercel/blob";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import type { ConfirmedMedia } from "@/features/media/types/confirmed-media";
import type { MediaUpload } from "@/features/media/types/media-upload";
import type { UploadClaim } from "@/features/media/types/upload-claim";
import { toUploadKey } from "@/features/media/utils/to-upload-key";

interface Props {
  uploads: MediaUpload[];
  userId: string;
}

/**
 * Checks every upload the browser asks to attach against what is actually stored.
 *
 * Each one must still be claimed, by this identity: a claim lasts exactly the grace the sweep
 * gives an unattached file, so a claimed file is never swept out from under it. Then the store is
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
  const notFound = {
    data: null,
    error: {
      code: "MEDIA_NOT_FOUND" as const,
      message: "One of your files didn't finish uploading",
    },
  };
  const failure = {
    data: null,
    error: { code: "FAILED_TO_CONFIRM_MEDIA" as const, message: "Couldn't check your files" },
  };

  if (new Set(pathnames).size !== pathnames.length) {
    return { data: null, error: { code: "INVALID_MEDIA", message: "A file was attached twice" } };
  }

  const { data: claims, error } = await tryCatch(
    redis.mget<(string | null)[]>(...pathnames.map((pathname) => toUploadKey({ pathname }))),
  );

  if (error) return failure;

  const kinds = claims.map((claim) => {
    const parsed = claim ? (JSON.parse(claim) as UploadClaim) : null;

    return parsed?.uploaderId === userId ? parsed.kind : null;
  });

  if (kinds.some((kind) => !kind)) return notFound;

  const { data: blobs, error: headError } = await tryCatch(
    Promise.all(pathnames.map((pathname) => head(pathname))),
  );

  if (headError) return headError instanceof BlobNotFoundError ? notFound : failure;

  const confirmed: ConfirmedMedia[] = [];

  for (const [position, upload] of uploads.entries()) {
    const kind = kinds[position];
    const blob = blobs[position];

    if (
      !kind ||
      !blob ||
      !MEDIA_RULES[kind].contentTypes.includes(blob.contentType) ||
      blob.size > MEDIA_RULES[kind].maxBytes
    ) {
      return {
        data: null,
        error: { code: "INVALID_MEDIA", message: "One of your files isn't one that can be shared" },
      };
    }

    confirmed.push({
      id: crypto.randomUUID(),
      kind,
      url: blob.url,
      contentType: blob.contentType,
      width: kind === "audio" ? null : upload.width,
      height: kind === "audio" ? null : upload.height,
      pathname: upload.pathname,
      size: blob.size,
      position,
    });
  }

  return { data: confirmed, error: null };
};
