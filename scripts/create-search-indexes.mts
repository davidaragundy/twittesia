import { redis } from "@/shared/lib/redis/server";

import { CONTENT_INDEX } from "@/features/posts/constants/content-index";

// Run by every build. An index that already exists is left as it is, so running it again changes
// nothing.
await redis.search.createIndex({ ...CONTENT_INDEX, dataType: "hash", existsOk: true });

console.log(`Search index ${CONTENT_INDEX.name} is ready`);
