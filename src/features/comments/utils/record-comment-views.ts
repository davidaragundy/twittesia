import "server-only";

import { and, eq, gt, inArray, ne } from "drizzle-orm";

import { comment, commentView, post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

interface Props {
  commentIds: string[];
  viewerId: string;
}

// Skips the viewer's own comments and those on expired posts; a view already counted stays as it is
export const recordCommentViews = async ({
  commentIds,
  viewerId,
}: Props): Promise<ActionResponse<{ recorded: number }, "FAILED_TO_RECORD_VIEWS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_RECORD_VIEWS" as const, message: "Couldn't record the views" },
  };

  const { data: eligible, error: eligibleError } = await tryCatch(
    db
      .select({ id: comment.id })
      .from(comment)
      .innerJoin(post, eq(post.id, comment.postId))
      .where(
        and(
          inArray(comment.id, commentIds),
          ne(comment.userId, viewerId),
          gt(post.expiresAt, new Date()),
        ),
      ),
  );

  if (eligibleError) return failure;

  if (!eligible.length) return { data: { recorded: 0 }, error: null };

  const { data: inserted, error: insertError } = await tryCatch(
    db
      .insert(commentView)
      .values(eligible.map(({ id }) => ({ commentId: id, userId: viewerId })))
      .onConflictDoNothing()
      .returning({ commentId: commentView.commentId }),
  );

  if (insertError) return failure;

  return { data: { recorded: inserted.length }, error: null };
};
