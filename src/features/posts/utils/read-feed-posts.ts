import "server-only";

import { desc, eq, inArray, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { comment, post, postReaction, postView, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import type { FeedPost } from "@/features/posts/types/feed-post";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { groupReactions } from "@/features/posts/utils/group-reactions";
import { postScoreSql } from "@/features/posts/utils/post-score-sql";

interface Props {
  condition: SQL | undefined;
  limit: number;
  sort?: FeedSort;
  // The reader, so each post knows whether they can delete it and which reactions are theirs
  viewerId?: string | null;
}

// In the order that was asked for, with everything the feed and a post's page show of each post
export const readFeedPosts = async ({
  condition,
  limit,
  sort = DEFAULT_FEED_SORT,
  viewerId,
}: Props): Promise<ActionResponse<FeedPost[], "FAILED_TO_READ_POSTS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_READ_POSTS" as const, message: "Couldn't load the posts" },
  };

  const { data: rows, error } = await tryCatch(
    db
      .select({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        authorId: post.userId,
        authorName: user.name,
        authorUsername: user.username,
        authorDisplayUsername: user.displayUsername,
        viewCount: sql<number>`(select count(*)::int from ${postView} where ${postView.postId} = ${post.id})`,
        commentCount: sql<number>`(select count(*)::int from ${comment} where ${comment.postId} = ${post.id})`,
      })
      .from(post)
      .leftJoin(user, eq(user.id, post.userId))
      .where(condition)
      .orderBy(
        ...(sort === "popular" ? [desc(postScoreSql)] : []),
        desc(post.createdAt),
        desc(post.id),
      )
      .limit(limit),
  );

  if (error) return failure;

  const { data: counts, error: countsError } = rows.length
    ? await tryCatch(
        db
          .select({
            targetId: postReaction.postId,
            emoji: postReaction.reaction,
            count: sql<number>`count(*)::int`,
            isMine: sql<boolean>`coalesce(bool_or(${postReaction.userId} = ${viewerId ?? null}), false)`,
          })
          .from(postReaction)
          .where(
            inArray(
              postReaction.postId,
              rows.map((row) => row.id),
            ),
          )
          .groupBy(postReaction.postId, postReaction.reaction)
          .orderBy(sql`min(${postReaction.createdAt})`),
      )
    : { data: [], error: null };

  if (countsError) return failure;

  const reactions = groupReactions({ counts });

  return {
    data: rows.map((row) => ({
      id: row.id,
      content: row.content,
      createdAt: row.createdAt,
      author:
        row.authorId && row.authorName && row.authorUsername
          ? {
              name: row.authorName,
              username: row.authorUsername,
              displayUsername: row.authorDisplayUsername ?? row.authorUsername,
            }
          : null,
      isMine: !!row.authorId && row.authorId === viewerId,
      reactions: reactions.get(row.id) ?? [],
      viewCount: row.viewCount,
      commentCount: row.commentCount,
    })),
    error: null,
  };
};
