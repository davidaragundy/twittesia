import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// A page says someone is writing at most every few seconds, so this only catches one that isn't
// asking politely
export const typingRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:chat-typing:identity",
    limiter: Ratelimit.slidingWindow(40, "1 m"),
  }),
};
