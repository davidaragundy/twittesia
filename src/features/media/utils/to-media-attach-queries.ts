import "server-only";

import { eq } from "drizzle-orm";

import { media } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";

import type { ConfirmedMedia } from "@/features/media/types/confirmed-media";
import type { MediaOwner } from "@/features/media/types/media-owner";

interface Props {
  confirmed: ConfirmedMedia[];
  owner: MediaOwner;
}

// The writes that attach confirmed uploads to what they belong to, to run in the same batch that
// creates it, so a post or a comment is never saved without its files or its files without it
export const toMediaAttachQueries = ({ confirmed, owner }: Props) =>
  confirmed.map((item) =>
    db
      .update(media)
      .set({
        url: item.url,
        contentType: item.contentType,
        size: item.size,
        width: item.width,
        height: item.height,
        position: item.position,
        postId: owner.postId ?? null,
        commentId: owner.commentId ?? null,
        attachedAt: new Date(),
      })
      .where(eq(media.id, item.id)),
  );
