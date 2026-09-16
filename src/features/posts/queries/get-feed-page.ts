import "server-only";

import { and, desc, eq, gt, inArray, lt, sql } from "drizzle-orm";

import { post, postReaction, user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { FEED_PAGE_SIZE } from "@/features/posts/constants/feed-page-size";
import type { FeedPage } from "@/features/posts/types/feed-page";
import { parseFeedCursor, toFeedCursor } from "@/features/posts/utils/feed-cursor";
import { groupPostReactions } from "@/features/posts/utils/group-post-reactions";

interface Props {
  cursor?: string | null;
  // The reader, so each post knows whether they can delete it and which reactions are theirs
  viewerId?: string | null;
}

// Expiry is applied here rather than trusted to the purge, so a post is never read past its
// lifespan, whenever the expired rows are actually deleted
export const getFeedPage = async ({
  cursor,
  viewerId,
}: Props): Promise<ActionResponse<FeedPage, "FAILED_TO_LOAD_FEED">> => {
  const after = parseFeedCursor(cursor);

  const { data, error } = await tryCatch(
    db
      .select({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        authorId: post.userId,
        authorName: user.name,
        authorUsername: user.username,
        authorDisplayUsername: user.displayUsername,
      })
      .from(post)
      .leftJoin(user, eq(user.id, post.userId))
      .where(
        and(
          gt(post.expiresAt, new Date()),
          after
            ? lt(sql`(${post.createdAt}, ${post.id})`, sql`(${after.createdAt}, ${after.id})`)
            : undefined,
        ),
      )
      .orderBy(desc(post.createdAt), desc(post.id))
      // One more than the page, to tell whether another page follows
      .limit(FEED_PAGE_SIZE + 1),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_FEED", message: "Couldn't load the feed" },
    };
  }

  const rows = data.slice(0, FEED_PAGE_SIZE);
  const last = rows.at(-1);

  const { data: counts, error: countsError } = rows.length
    ? await tryCatch(
        db
          .select({
            postId: postReaction.postId,
            reaction: postReaction.reaction,
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
          .groupBy(postReaction.postId, postReaction.reaction),
      )
    : { data: [], error: null };

  if (countsError) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_FEED", message: "Couldn't load the feed" },
    };
  }

  const reactions = groupPostReactions({ counts });

  return {
    data: {
      posts: rows.map((row) => ({
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
      })),
      nextCursor: data.length > FEED_PAGE_SIZE && last ? toFeedCursor(last) : null,
    },
    error: null,
  };
};
