import "server-only";

import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { media } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { MEDIA_CACHE_MAX_AGE_SECONDS } from "@/features/media/constants/media-cache-max-age-seconds";
import { MEDIA_PATHNAME_PATTERN } from "@/features/media/constants/media-pathname-pattern";
import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import { MEDIA_TOKEN_LIFETIME_MS } from "@/features/media/constants/media-token-lifetime-ms";
import { mediaKindSchema } from "@/features/media/schemas/media-kind-schema";

interface Props {
  request: Request;
  // Who is asking, read by the route: an upload is only ever authorised for an identity
  userId: string | null;
}

/**
 * Authorises one upload, which the browser then sends straight to Blob: a file never passes
 * through a function, whose request body is capped at 4.5 MB.
 *
 * It answers with a presigned URL, signed with a token the store issues over OIDC, so no
 * long-lived read-write token exists anywhere. The URL only allows the kind the browser declared,
 * up to that kind's size, at the path it proposed, once. The path is recorded here, before the
 * file exists, so an upload whose post or comment never arrives is still known to the sweep and
 * deleted.
 */
export const handleMediaUploadRequest = async ({ request, userId }: Props) => {
  if (!userId) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { data: body, error: bodyError } = await tryCatch<HandleUploadPresignedBody>(
    request.json(),
  );

  // Completion callbacks are not listened for, so nothing may arrive pretending to be one
  if (bodyError || body.type !== "blob.generate-presigned-url") {
    return NextResponse.json({ message: "Invalid upload" }, { status: 400 });
  }

  const { data, error } = await tryCatch(
    handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        const kind = mediaKindSchema.safeParse(clientPayload);
        const extension = pathname.split(".").at(-1) ?? "";

        if (
          !kind.success ||
          !MEDIA_PATHNAME_PATTERN.test(pathname) ||
          !Object.values(MEDIA_RULES[kind.data].extensions).includes(extension)
        ) {
          throw new Error("That file can't be uploaded");
        }

        const rule = MEDIA_RULES[kind.data];

        const validUntil = Date.now() + MEDIA_TOKEN_LIFETIME_MS;

        // Scoped to this one path and to writing it, so the token can sign nothing else
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: rule.contentTypes,
          maximumSizeInBytes: rule.maxBytes,
          validUntil,
        });

        // Recorded only once the token exists, and before its URL is handed out. The path is
        // unique, so a second request for the same path fails here and gets no URL.
        await db
          .insert(media)
          .values({ id: crypto.randomUUID(), userId, pathname, kind: kind.data });

        return {
          token,
          urlOptions: {
            allowedContentTypes: rule.contentTypes,
            maximumSizeInBytes: rule.maxBytes,
            validUntil,
            addRandomSuffix: false,
            allowOverwrite: false,
            cacheControlMaxAge: MEDIA_CACHE_MAX_AGE_SECONDS,
          },
        };
      },
    }),
  );

  if (error) {
    return NextResponse.json({ message: "That file can't be uploaded" }, { status: 400 });
  }

  return NextResponse.json(data);
};
