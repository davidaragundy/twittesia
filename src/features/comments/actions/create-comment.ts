"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { CREATE_COMMENT_SCRIPT } from "@/features/comments/constants/create-comment-script";
import { createCommentSchema } from "@/features/comments/schemas/create-comment-schema";
import type { CreateCommentInput } from "@/features/comments/types/create-comment-input";
import type { PostComment } from "@/features/comments/types/post-comment";
import { toCommentKey } from "@/features/comments/utils/to-comment-key";
import { RANK_SCORE_WEIGHT } from "@/features/posts/constants/rank-score-weight";
import { getContentIndex } from "@/features/posts/utils/get-content-index";
import { toPostKey } from "@/features/posts/utils/to-post-key";
import { toRank } from "@/features/posts/utils/to-rank";

// Written in one script with its post, so a comment never lands on a post deleted a moment ago
export const createComment = async (
  values: CreateCommentInput,
): Promise<
  ActionResponse<PostComment, "POST_NOT_FOUND" | "INVALID_MEDIA" | BaseActionErrorCode>
> => {
  const input = createCommentSchema.safeParse(values);

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  // Attachments move to Redis in their own step of the migration
  if (input.data.media.length) {
    return {
      data: null,
      error: { code: "INVALID_MEDIA", message: "Attaching files is coming back shortly" },
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
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  const { data: expiresAt, error } = await tryCatch(
    redis.eval<string[], number>(
      CREATE_COMMENT_SCRIPT,
      [
        toPostKey({ id: input.data.postId }),
        toCommentKey({ id }),
        toIdentityKey({ id: user.id }),
        toHandleKey({ handle: user.username }),
      ],
      [
        String(createdAt),
        String(RANK_SCORE_WEIGHT),
        ...Object.entries({
          id,
          type: "comment",
          postId: input.data.postId,
          authorId: user.id,
          authorHandle: user.username,
          authorName: user.name,
          content: input.data.content,
          media: "[]",
          reactions: "[]",
          reactionCount: "0",
          viewCount: "0",
          createdAt: String(createdAt),
          rank: String(toRank({ score: 0, createdAt })),
        }).flat(),
      ],
    ),
  );

  if (error) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your comment" } };
  }

  if (Number(expiresAt) < 0) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  // Indexing trails a write; answering once the index has the comment means a reload straight
  // after still finds it. The comment is saved either way.
  await tryCatch(getContentIndex().waitIndexing());

  return {
    data: {
      id,
      postId: input.data.postId,
      content: input.data.content,
      createdAt: new Date(createdAt),
      author: { name: user.name, username: user.username, displayUsername: user.username },
      isMine: true,
      reactions: [],
      media: [],
      viewCount: 0,
    },
    error: null,
  };
};
