import { redis } from "@/shared/lib/redis/server";

import { CONTENT_INDEX } from "@/features/posts/constants/content-index";

// Run by every build. An index that already exists is left as it is, so running it again changes
// nothing. The free plan allows one index, so a change to its schema can't sit beside the old
// one: `--recreate` drops it first, and the index fills itself again from the hashes.
if (process.argv.includes("--recreate")) {
  await redis.search
    .index({ name: CONTENT_INDEX.name })
    .drop()
    .catch(() => 0);
  console.log(`Search index ${CONTENT_INDEX.name} dropped`);
}

await redis.search.createIndex({ ...CONTENT_INDEX, dataType: "hash", existsOk: true });

console.log(`Search index ${CONTENT_INDEX.name} is ready`);
