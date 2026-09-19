import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Deleting posts and comments alike
export const deleteRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:delete:identity",
    limiter: Ratelimit.slidingWindow(30, "1 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:delete:ip",
    limiter: Ratelimit.slidingWindow(90, "1 m"),
  }),
};
