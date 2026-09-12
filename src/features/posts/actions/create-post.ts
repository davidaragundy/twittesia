"use server";

import { post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { LIFESPAN_HOURS } from "@/features/posts/constants/lifespan-hours";
import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";
import type { FeedPost } from "@/features/posts/types/feed-post";

export const createPost = async (
  values: CreatePostFormValues,
): Promise<ActionResponse<FeedPost, BaseActionErrorCode>> => {
  const input = createPostFormSchema.safeParse(values);

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const { user } = session;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + LIFESPAN_HOURS * 60 * 60 * 1_000);

  const { data, error } = await tryCatch(
    db
      .insert(post)
      .values({
        id: crypto.randomUUID(),
        // A ghost is stored with no author, so nothing ties it back to this account
        userId: input.data.isGhost ? null : user.id,
        content: input.data.content,
        createdAt,
        expiresAt,
      })
      .returning({ id: post.id, content: post.content, createdAt: post.createdAt }),
  );

  if (error || !data[0]) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your post" } };
  }

  return {
    data: {
      ...data[0],
      author: input.data.isGhost
        ? null
        : {
            name: user.name,
            username: user.username ?? "",
            displayUsername: user.displayUsername ?? user.username ?? "",
            image: user.image ?? null,
          },
      isMine: !input.data.isGhost,
    },
    error: null,
  };
};
