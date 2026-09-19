import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";

interface Props {
  keys: string[];
}

/**
 * The hashes behind a page of search results, read in one pipelined request.
 *
 * The search index answers with values it has parsed as JSON wherever they look like it, so a
 * post that says `null` or `{ "a": 1 }` would come back as something else. The index only finds
 * and orders the keys; the text is read from the hashes themselves, exactly as it was written.
 * A key the index still lists but whose hash has gone — deleted a moment ago — reads as null.
 */
export const readPostHashes = async ({ keys }: Props) => {
  if (!keys.length) return [];

  const pipeline = redis.pipeline();

  for (const key of keys) pipeline.hgetall(key);

  const replies = await pipeline.exec();

  return replies.map((reply) => toHashRecord({ reply }));
};
