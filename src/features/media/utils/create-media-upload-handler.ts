import "server-only";

import { BlobError, uploadHandler } from "@upstash/blob";

import { bucket } from "@/shared/lib/blob/server";
import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { BLOB_EXPIRY_KEY } from "@/features/media/constants/blob-expiry-key";
import { CLAIM_UPLOAD_SCRIPT } from "@/features/media/constants/claim-upload-script";
import { LAND_UPLOAD_SCRIPT } from "@/features/media/constants/land-upload-script";
import { MEDIA_CACHE_MAX_AGE_SECONDS } from "@/features/media/constants/media-cache-max-age-seconds";
import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import { PENDING_MEDIA_GRACE_MS } from "@/features/media/constants/pending-media-grace-ms";
import { mediaKindSchema } from "@/features/media/schemas/media-kind-schema";
import type { UploadClaim } from "@/features/media/types/upload-claim";
import { toMediaPathname } from "@/features/media/utils/to-media-pathname";
import { toUploadKey } from "@/features/media/utils/to-upload-key";

interface Props {
  // Who is asking, looked up by the route: an upload is only ever authorised for an identity
  getUploaderId: () => Promise<string | null>;
}

/**
 * Authorises uploads the browser then sends straight to the bucket, one route per kind, each
 * enforcing that kind's types and size before anything is signed. A file never passes through a
 * function.
 *
 * The path is named here, never by the browser, and claimed and scheduled for deletion before the
 * file exists, so an upload whose post or comment never arrives is still swept once its grace
 * ends. Once the file has landed, the claim records what was stored, so attaching it needs no
 * request to the bucket.
 */
export const createMediaUploadHandler = ({ getUploaderId }: Props) =>
  uploadHandler({
    bucket,
    // Every file goes up as one PUT, so an upload abandoned halfway is never a set of parts only
    // a multipart sweep could find: it is nothing, or a whole file already claimed and scheduled
    multipart: false,
    context: async () => {
      const uploaderId = await getUploaderId();

      if (!uploaderId) {
        throw new BlobError("unauthorized", { message: "You need an identity to do that" });
      }

      return uploaderId;
    },
    onBeforeUpload: async ({ ctx, route, file }) => {
      const kind = mediaKindSchema.parse(route);

      if (!MEDIA_RULES[kind].extensions[file.type]) {
        throw new BlobError("content_type_not_allowed", { message: "That file can't be uploaded" });
      }

      const path = toMediaPathname({ kind, contentType: file.type });
      const claim: UploadClaim = { uploaderId: ctx, kind };

      const { data: claimed, error } = await tryCatch(
        redis.eval<string[], number>(
          CLAIM_UPLOAD_SCRIPT,
          [toUploadKey({ pathname: path }), BLOB_EXPIRY_KEY],
          [
            JSON.stringify(claim),
            String(PENDING_MEDIA_GRACE_MS),
            path,
            String(Date.now() + PENDING_MEDIA_GRACE_MS),
          ],
        ),
      );

      if (error) throw new BlobError("not_ready", { message: "Couldn't start your upload" });
      if (Number(claimed) !== 1) throw new BlobError("conflict", { message: "Please try again" });

      return { path, cache: MEDIA_CACHE_MAX_AGE_SECONDS };
    },
    // Throwing here deletes the file, which is right: a file whose landing isn't recorded can
    // never be attached. It may run twice for one upload, and recording twice is harmless.
    onUploadComplete: async ({ ctx, path, url, contentType, size }) => {
      if (!url) throw new BlobError("forbidden", { message: "The bucket must be public" });

      const { data: landed, error } = await tryCatch(
        redis.eval<string[], number>(
          LAND_UPLOAD_SCRIPT,
          [toUploadKey({ pathname: path })],
          [ctx, JSON.stringify({ url, contentType, size })],
        ),
      );

      if (error) throw new BlobError("not_ready", { message: "Couldn't finish your upload" });
      if (Number(landed) !== 1) throw new BlobError("forbidden", { message: "Upload expired" });
    },
    routes: {
      image: {
        constraints: {
          maxSize: MEDIA_RULES.image.maxBytes,
          contentTypes: MEDIA_RULES.image.contentTypes,
        },
      },
      video: {
        constraints: {
          maxSize: MEDIA_RULES.video.maxBytes,
          contentTypes: MEDIA_RULES.video.contentTypes,
        },
      },
      audio: {
        constraints: {
          maxSize: MEDIA_RULES.audio.maxBytes,
          contentTypes: MEDIA_RULES.audio.contentTypes,
        },
      },
    },
  });
