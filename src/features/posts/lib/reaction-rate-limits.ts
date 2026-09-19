import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Reacting and unreacting to posts and comments alike: quick, but not scripted
export const reactionRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:reaction:identity",
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:reaction:ip",
    limiter: Ratelimit.slidingWindow(180, "1 m"),
  }),
};
