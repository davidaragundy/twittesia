import "server-only";

import { and, asc, inArray, isNotNull } from "drizzle-orm";

import { media } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Media } from "@/features/media/types/media";
import type { MediaKind } from "@/features/media/types/media-kind";

interface Props {
  // Whether the ids are of posts or of comments
  owner: "post" | "comment";
  ids: string[];
}

// The files attached to a page of posts or comments, keyed by what they belong to, in the order
// they were attached
export const readMedia = async ({
  owner,
  ids,
}: Props): Promise<ActionResponse<Map<string, Media[]>, "FAILED_TO_READ_MEDIA">> => {
  if (!ids.length) return { data: new Map(), error: null };

  const ownerId = owner === "post" ? media.postId : media.commentId;

  const { data, error } = await tryCatch(
    db
      .select({
        id: media.id,
        ownerId,
        kind: media.kind,
        url: media.url,
        contentType: media.contentType,
        width: media.width,
        height: media.height,
      })
      .from(media)
      .where(and(inArray(ownerId, ids), isNotNull(media.url)))
      .orderBy(asc(media.position)),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_READ_MEDIA", message: "Couldn't load the attached files" },
    };
  }

  const grouped = new Map<string, Media[]>();

  for (const { ownerId: key, url, contentType, kind, ...item } of data) {
    if (!key || !url || !contentType) continue;

    grouped.set(key, [
      ...(grouped.get(key) ?? []),
      { ...item, kind: kind as MediaKind, url, contentType },
    ]);
  }

  return { data: grouped, error: null };
};
