import "server-only";

import { and, asc, eq, gt, sql } from "drizzle-orm";

import { comment, post, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants/comments-page-size";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { parseCommentCursor } from "@/features/comments/utils/parse-comment-cursor";
import { toCommentCursor } from "@/features/comments/utils/to-comment-cursor";

interface Props {
  postId: string;
  cursor?: string | null;
  viewerId?: string | null;
}

// Oldest first. A post that has expired has no comments to show, whenever its rows are deleted.
export const getCommentsPage = async ({
  postId,
  cursor,
  viewerId,
}: Props): Promise<ActionResponse<CommentsPage, "FAILED_TO_LOAD_COMMENTS">> => {
  const after = parseCommentCursor(cursor);

  const { data, error } = await tryCatch(
    db
      .select({
        id: comment.id,
        postId: comment.postId,
        content: comment.content,
        createdAt: comment.createdAt,
        authorId: comment.userId,
        authorName: user.name,
        authorUsername: user.username,
        authorDisplayUsername: user.displayUsername,
      })
      .from(comment)
      .innerJoin(post, eq(post.id, comment.postId))
      .innerJoin(user, eq(user.id, comment.userId))
      .where(
        and(
          eq(comment.postId, postId),
          gt(post.expiresAt, new Date()),
          after
            ? gt(sql`(${comment.createdAt}, ${comment.id})`, sql`(${after.createdAt}, ${after.id})`)
            : undefined,
        ),
      )
      .orderBy(asc(comment.createdAt), asc(comment.id))
      // One more than the page, to tell whether another page follows
      .limit(COMMENTS_PAGE_SIZE + 1),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_COMMENTS", message: "Couldn't load the comments" },
    };
  }

  const comments = data.slice(0, COMMENTS_PAGE_SIZE).map((row) => ({
    id: row.id,
    postId: row.postId,
    content: row.content,
    createdAt: row.createdAt,
    author: {
      name: row.authorName,
      username: row.authorUsername ?? "",
      displayUsername: row.authorDisplayUsername ?? row.authorUsername ?? "",
    },
    isMine: row.authorId === viewerId,
  }));
  const last = comments.at(-1);

  return {
    data: {
      comments,
      nextCursor: data.length > COMMENTS_PAGE_SIZE && last ? toCommentCursor(last) : null,
    },
    error: null,
  };
};
