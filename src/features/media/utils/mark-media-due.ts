import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { BLOB_EXPIRY_KEY } from "@/features/media/constants/blob-expiry-key";

interface Props {
  // What the hashes being deleted held in their mediaPaths field, as JSON arrays
  mediaPaths: (string | null | undefined)[];
}

// Brings the files of deleted posts or comments forward to now, so the next sweep deletes them.
// XX: only files still scheduled; nothing is scheduled that wasn't.
export const markMediaDue = async ({ mediaPaths }: Props) => {
  const pathnames = mediaPaths.flatMap((paths) => (paths ? (JSON.parse(paths) as string[]) : []));

  const now = Date.now();
  const [first, ...rest] = pathnames.map((pathname) => ({ score: now, member: pathname }));

  if (!first) return;

  await tryCatch(redis.zadd(BLOB_EXPIRY_KEY, { xx: true }, first, ...rest));
};
