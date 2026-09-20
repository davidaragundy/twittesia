import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Knocking is how a stranger reaches someone who has never heard of them, so it is held tighter
// than writing is
export const knockRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:knock:identity",
    limiter: Ratelimit.slidingWindow(10, "10 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:knock:ip",
    limiter: Ratelimit.slidingWindow(20, "10 m"),
  }),
};
