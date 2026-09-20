import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// A chat is one link for one person, so nobody needs many of them
export const startChatRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:start-chat:identity",
    limiter: Ratelimit.slidingWindow(10, "10 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:start-chat:ip",
    limiter: Ratelimit.slidingWindow(20, "10 m"),
  }),
};
