"use server";

import { after } from "next/server";
import { z } from "zod";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { sweepDueMedia } from "@/features/media/utils/sweep-due-media";
import { deletePosts } from "@/features/posts/utils/delete-posts";
import { toPostKey } from "@/features/posts/utils/to-post-key";

// Only the author can delete a post. Someone else's post reads as already gone, so nobody learns
// anything by trying.
export const deletePost = async (
  postId: string,
): Promise<ActionResponse<null, "POST_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = z.string().min(1).safeParse(postId);

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "Invalid post" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const key = toPostKey({ id: input.data });
  const { data: authorId, error: readError } = await tryCatch(redis.hget<string>(key, "authorId"));

  if (readError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't delete your post" } };
  }

  if (!authorId || authorId !== session.user.id) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  const { error } = await deletePosts({ keys: [key] });

  if (error)
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't delete your post" } };

  // Its files leave Blob once the answer has been sent, rather than a day later with the cron
  after(sweepDueMedia);

  return { data: null, error: null };
};
