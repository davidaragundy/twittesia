import "server-only";

import { inArray, sql } from "drizzle-orm";

import { commentReaction } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Reaction } from "@/features/posts/types/reaction";
import { groupReactions } from "@/features/posts/utils/group-reactions";

interface Props {
  commentIds: string[];
  // The reader, so each reaction knows whether it is theirs
  viewerId?: string | null;
}

// The reactions on a page of comments, keyed by comment and in the order each emoji was first added
export const readCommentReactions = async ({
  commentIds,
  viewerId,
}: Props): Promise<ActionResponse<Map<string, Reaction[]>, "FAILED_TO_READ_REACTIONS">> => {
  if (!commentIds.length) return { data: new Map(), error: null };

  const { data, error } = await tryCatch(
    db
      .select({
        targetId: commentReaction.commentId,
        emoji: commentReaction.reaction,
        count: sql<number>`count(*)::int`,
        isMine: sql<boolean>`coalesce(bool_or(${commentReaction.userId} = ${viewerId ?? null}), false)`,
      })
      .from(commentReaction)
      .where(inArray(commentReaction.commentId, commentIds))
      .groupBy(commentReaction.commentId, commentReaction.reaction)
      .orderBy(sql`min(${commentReaction.createdAt})`),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_READ_REACTIONS", message: "Couldn't load the reactions" },
    };
  }

  return { data: groupReactions({ counts: data }), error: null };
};
