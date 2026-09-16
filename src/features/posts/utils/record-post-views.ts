import "server-only";

import { and, gt, inArray, isNull, ne, or } from "drizzle-orm";

import { post, postView } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

interface Props {
  postIds: string[];
  viewerId: string;
}

// Skips the viewer's own posts and expired ones; a view already counted is left as it is
export const recordPostViews = async ({
  postIds,
  viewerId,
}: Props): Promise<ActionResponse<{ recorded: number }, "FAILED_TO_RECORD_VIEWS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_RECORD_VIEWS" as const, message: "Couldn't record the views" },
  };

  const { data: eligible, error: eligibleError } = await tryCatch(
    db
      .select({ id: post.id })
      .from(post)
      .where(
        and(
          inArray(post.id, postIds),
          gt(post.expiresAt, new Date()),
          or(isNull(post.userId), ne(post.userId, viewerId)),
        ),
      ),
  );

  if (eligibleError) return failure;

  if (!eligible.length) return { data: { recorded: 0 }, error: null };

  const { data: inserted, error: insertError } = await tryCatch(
    db
      .insert(postView)
      .values(eligible.map(({ id }) => ({ postId: id, userId: viewerId })))
      .onConflictDoNothing()
      .returning({ postId: postView.postId }),
  );

  if (insertError) return failure;

  return { data: { recorded: inserted.length }, error: null };
};
