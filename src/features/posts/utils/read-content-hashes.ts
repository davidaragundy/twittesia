import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";

import { toReactedKey } from "@/features/posts/utils/to-reacted-key";

interface Props {
  keys: string[];
  // The reader, whose own reactions are read alongside
  viewerId?: string | null;
}

/**
 * The post or comment hashes behind a page of search results, and the reader's own reactions on
 * each, in one pipelined request.
 *
 * The search index answers with values it has parsed as JSON wherever they look like it, so a
 * post that says `null` or `{ "a": 1 }` would come back as something else. The index only finds
 * and orders the keys; the text is read from the hashes themselves, exactly as it was written.
 * A key the index still lists but whose hash has gone — deleted a moment ago — reads as null.
 */
export const readContentHashes = async ({ keys, viewerId }: Props) => {
  if (!keys.length) return [];

  const pipeline = redis.pipeline();

  for (const key of keys) {
    pipeline.hgetall(key);
    if (viewerId) pipeline.smembers(toReactedKey({ targetKey: key, identityId: viewerId }));
  }

  const replies = await pipeline.exec();
  const stride = viewerId ? 2 : 1;

  return keys.map((_, index) => ({
    hash: toHashRecord({ reply: replies[index * stride] }),
    mine: viewerId ? (replies[index * stride + 1] as string[]) : [],
  }));
};
