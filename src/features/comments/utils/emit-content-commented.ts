import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { realtime } from "@/features/posts/lib/realtime";
import { toPostKey } from "@/features/posts/utils/to-post-key";

interface Props {
  postId: string;
  authorId: string;
}

// Tells a post's open pages it has a new comment, and what its count became. The comment itself
// is read from the store by whoever is looking at the post.
export const emitContentCommented = async ({ postId, authorId }: Props) => {
  const { data, error } = await tryCatch(
    redis.hget<string>(toPostKey({ id: postId }), "commentCount"),
  );

  if (error) return;

  await tryCatch(
    realtime.emit("content.commented", { postId, authorId, commentCount: Number(data) || 0 }),
  );
};
