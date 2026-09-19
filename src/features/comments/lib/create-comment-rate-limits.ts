import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Comments come faster than posts in a conversation, but not endlessly
export const createCommentRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:create-comment:identity",
    limiter: Ratelimit.slidingWindow(30, "10 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:create-comment:ip",
    limiter: Ratelimit.slidingWindow(90, "10 m"),
  }),
};
