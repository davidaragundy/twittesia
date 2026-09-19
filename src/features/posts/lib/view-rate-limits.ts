import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Recording views of posts and comments alike. A page sends them in batches as they scroll past,
// so this is well above what reading can produce.
export const viewRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:view:identity",
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:view:ip",
    limiter: Ratelimit.slidingWindow(180, "1 m"),
  }),
};
