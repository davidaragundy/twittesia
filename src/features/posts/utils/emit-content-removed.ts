import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { realtime } from "@/features/posts/lib/realtime";
import type { ContentType } from "@/features/posts/types/content-type";
import { toPostKey } from "@/features/posts/utils/to-post-key";

interface Props {
  id: string;
  type: ContentType;
  // The post a comment was left on, so its page knows; nothing for a post
  postId?: string | null;
  authorId: string;
}

// Tells open pages something is gone, so it leaves them as it left the store. A comment carries
// what its post's count became, read back rather than counted here.
export const emitContentRemoved = async ({ id, type, postId = null, authorId }: Props) => {
  const { data } = postId
    ? await tryCatch(redis.hget<string>(toPostKey({ id: postId }), "commentCount"))
    : { data: null };

  await tryCatch(
    realtime.emit("content.removed", {
      id,
      type,
      postId,
      authorId,
      commentCount: data === null ? null : Number(data) || 0,
    }),
  );
};
