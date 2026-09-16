import "server-only";

import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";

import { comment, commentReaction, commentView, post, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants/comments-page-size";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { parseCommentCursor } from "@/features/comments/utils/parse-comment-cursor";
import { toCommentCursor } from "@/features/comments/utils/to-comment-cursor";
import { groupReactions } from "@/features/posts/utils/group-reactions";

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
        viewCount: sql<number>`(select count(*)::int from ${commentView} where ${commentView.commentId} = ${comment.id})`,
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

  const rows = data.slice(0, COMMENTS_PAGE_SIZE);

  const { data: counts, error: countsError } = rows.length
    ? await tryCatch(
        db
          .select({
            targetId: commentReaction.commentId,
            emoji: commentReaction.reaction,
            count: sql<number>`count(*)::int`,
            isMine: sql<boolean>`coalesce(bool_or(${commentReaction.userId} = ${viewerId ?? null}), false)`,
          })
          .from(commentReaction)
          .where(
            inArray(
              commentReaction.commentId,
              rows.map((row) => row.id),
            ),
          )
          .groupBy(commentReaction.commentId, commentReaction.reaction)
          .orderBy(sql`min(${commentReaction.createdAt})`),
      )
    : { data: [], error: null };

  if (countsError) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_COMMENTS", message: "Couldn't load the comments" },
    };
  }

  const reactions = groupReactions({ counts });

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
    isMine: row.authorId === viewerId,
    reactions: reactions.get(row.id) ?? [],
    viewCount: row.viewCount,
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
