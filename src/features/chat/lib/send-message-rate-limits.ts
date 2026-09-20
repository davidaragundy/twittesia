import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Fast enough for anyone typing, slow enough that a chat cannot be used as a firehose
export const sendMessageRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:send-message:identity",
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:send-message:ip",
    limiter: Ratelimit.slidingWindow(120, "1 m"),
  }),
};
