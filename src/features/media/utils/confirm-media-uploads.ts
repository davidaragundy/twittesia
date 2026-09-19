import "server-only";

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
 * Checks every upload the browser asks to attach against what was actually stored.
 *
 * Each one must still be claimed, by this identity: a claim lasts exactly the grace the sweep
 * gives an unattached file, so a claimed file is never swept out from under it. And it must have
 * landed: the upload route records the stored file's type and size on the claim once the bucket
 * has it, so the browser's word counts for nothing past this point.
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

  const parsed = claims.map((claim) => (claim ? (JSON.parse(claim) as UploadClaim) : null));

  if (parsed.some((claim) => claim?.uploaderId !== userId || !claim.landed)) return notFound;

  const confirmed: ConfirmedMedia[] = [];

  for (const [position, upload] of uploads.entries()) {
    const claim = parsed[position];
    const landed = claim?.landed;

    if (
      !claim ||
      !landed ||
      !MEDIA_RULES[claim.kind].contentTypes.includes(landed.contentType) ||
      landed.size > MEDIA_RULES[claim.kind].maxBytes
    ) {
      return {
        data: null,
        error: { code: "INVALID_MEDIA", message: "One of your files isn't one that can be shared" },
      };
    }

    confirmed.push({
      id: crypto.randomUUID(),
      kind: claim.kind,
      url: landed.url,
      contentType: landed.contentType,
      width: claim.kind === "audio" ? null : upload.width,
      height: claim.kind === "audio" ? null : upload.height,
      pathname: upload.pathname,
      size: landed.size,
      position,
    });
  }

  return { data: confirmed, error: null };
};
