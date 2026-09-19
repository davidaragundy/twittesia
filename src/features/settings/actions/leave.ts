"use server";

import { after } from "next/server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";

import { getSession } from "@/features/auth/queries/get-session";
import { clearSessionCookie } from "@/features/auth/utils/clear-session-cookie";
import { deleteIdentity } from "@/features/auth/utils/delete-identity";
import { deleteAuthorComments } from "@/features/comments/utils/delete-author-comments";
import { sweepDueMedia } from "@/features/media/utils/sweep-due-media";
import { deletePosts } from "@/features/posts/utils/delete-posts";
import { queryContentKeys } from "@/features/posts/utils/query-content-keys";

// Ends the identity now rather than at its expiry, and everything it wrote with it: its comments,
// its posts and every comment on them, and their files. The identity goes last, so a failure
// halfway leaves someone who can still try again rather than content nobody can delete.
export const leave = async (): Promise<
  ActionResponse<null, "FAILED_TO_DELETE_IDENTITY" | BaseActionErrorCode>
> => {
  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const failure = {
    data: null,
    error: { code: "UNKNOWN" as const, message: "Couldn't delete what you wrote" },
  };

  // Runs once the answer has been sent, whatever happens below: anything deleted before a failure
  // already has its files due
  after(sweepDueMedia);

  // Comments first, so the posts they sit on lose them from their counts
  const { error: commentsError } = await deleteAuthorComments({ authorId: session.user.id });

  if (commentsError) return failure;

  const { data: postKeys, error: queryError } = await queryContentKeys({
    filter: { type: "post", authorId: session.user.id },
  });

  if (queryError) return failure;

  const { error: postsError } = await deletePosts({ keys: postKeys });

  if (postsError) return failure;

  const { error } = await deleteIdentity({
    id: session.user.id,
    handle: session.user.username,
    sessionId: session.session.id,
  });

  if (error) return { data: null, error };

  await clearSessionCookie();

  return { data: null, error: null };
};
