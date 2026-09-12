"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";

// Only the author can delete a post, and a ghost has no author, so nobody can delete one
export const deletePost = async (
  postId: string,
): Promise<ActionResponse<null, "POST_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = z.string().min(1).safeParse(postId);

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "Invalid post" } };
  }

  const session = await getSession();

  if (!session) {
    return { data: null, error: { code: "UNAUTHORIZED", message: "You need to sign in" } };
  }

  const { data, error } = await tryCatch(
    db
      .delete(post)
      .where(and(eq(post.id, input.data), eq(post.userId, session.user.id)))
      .returning({ id: post.id }),
  );

  if (error) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't delete your post" } };
  }

  if (!data.length) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  return { data: null, error: null };
};
