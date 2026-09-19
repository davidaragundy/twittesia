import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// A burst of posts is fine; a stream of them is not
export const createPostRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:create-post:identity",
    limiter: Ratelimit.slidingWindow(10, "10 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:create-post:ip",
    limiter: Ratelimit.slidingWindow(30, "10 m"),
  }),
};
