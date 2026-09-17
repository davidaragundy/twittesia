import "server-only";

import { and, desc, eq, gt, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { comment, commentView, post, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants/comments-page-size";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { ProfileCommentsPage } from "@/features/comments/types/profile-comments-page";
import { commentCursorCondition } from "@/features/comments/utils/comment-cursor-condition";
import { commentScoreSql } from "@/features/comments/utils/comment-score-sql";
import { parseCommentCursor } from "@/features/comments/utils/parse-comment-cursor";
import { readCommentReactions } from "@/features/comments/utils/read-comment-reactions";
import { toCommentCursor } from "@/features/comments/utils/to-comment-cursor";

interface Props {
  username: string;
  cursor?: string | null;
  sort?: CommentSort;
  viewerId?: string | null;
}

// One person's comments, wherever they wrote them. A comment whose post has expired is already
// gone with it, whenever the rows are actually deleted.
export const getProfileCommentsPage = async ({
  username,
  cursor,
  sort = DEFAULT_COMMENT_SORT,
  viewerId,
}: Props): Promise<ActionResponse<ProfileCommentsPage, "FAILED_TO_LOAD_COMMENTS">> => {
  const after = parseCommentCursor({ cursor, sort });
  const postAuthor = alias(user, "post_author");

  const failure = {
    data: null,
    error: { code: "FAILED_TO_LOAD_COMMENTS" as const, message: "Couldn't load the comments" },
  };

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
        postAuthorUsername: postAuthor.username,
        viewCount: sql<number>`(select count(*)::int from ${commentView} where ${commentView.commentId} = ${comment.id})`,
      })
      .from(comment)
      .innerJoin(post, eq(post.id, comment.postId))
      .innerJoin(user, eq(user.id, comment.userId))
      .leftJoin(postAuthor, eq(postAuthor.id, post.userId))
      .where(
        and(
          eq(user.username, username),
          gt(post.expiresAt, new Date()),
          commentCursorCondition({ after, sort }),
        ),
      )
      .orderBy(
        ...(sort === "popular" ? [desc(commentScoreSql)] : []),
        desc(comment.createdAt),
        desc(comment.id),
      )
      // One more than the page, to tell whether another page follows
      .limit(COMMENTS_PAGE_SIZE + 1),
  );

  if (error) return failure;

  const rows = data.slice(0, COMMENTS_PAGE_SIZE);

  const { data: reactions, error: reactionsError } = await readCommentReactions({
    commentIds: rows.map((row) => row.id),
    viewerId,
  });

  if (reactionsError) return failure;

  const comments = rows.map((row) => ({
    id: row.id,
    postId: row.postId,
    content: row.content,
    createdAt: row.createdAt,
    author: {
      name: row.authorName,
      username: row.authorUsername ?? "",
      displayUsername: row.authorDisplayUsername ?? row.authorUsername ?? "",
    },
    postAuthorUsername: row.postAuthorUsername,
    isMine: row.authorId === viewerId,
    reactions: reactions.get(row.id) ?? [],
    viewCount: row.viewCount,
  }));
  const last = comments.at(-1);

  return {
    data: {
      comments,
      nextCursor:
        data.length > COMMENTS_PAGE_SIZE && last ? toCommentCursor({ comment: last, sort }) : null,
    },
    error: null,
  };
};
