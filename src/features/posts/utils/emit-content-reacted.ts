import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { realtime } from "@/features/posts/lib/realtime";
import type { ContentType } from "@/features/posts/types/content-type";

interface Props {
  // The post or comment hash the reaction landed on
  targetKey: string;
  id: string;
  type: ContentType;
  authorId: string;
}

/**
 * Tells open pages how a post or comment is reacted to now.
 *
 * The emoji and their counts are read back from the hash rather than counted here, so what open
 * pages are told is what the store holds, whoever else reacted at the same moment. A comment
 * carries the post it is on, so that post's page knows the event is for it. Who reacted is not
 * part of it: a page keeps its own reader's emoji as it knows them.
 */
export const emitContentReacted = async ({ targetKey, id, type, authorId }: Props) => {
  const pipeline = redis.pipeline();

  pipeline.hget(targetKey, "reactions").hget(targetKey, "postId");

  const { data, error } = await tryCatch(pipeline.exec<(string | null)[]>());

  if (error) return;

  const reactions = JSON.parse(data[0] || "[]") as { emoji: string; count: number }[];

  await tryCatch(
    realtime.emit("content.reacted", { id, type, postId: data[1] ?? null, authorId, reactions }),
  );
};
