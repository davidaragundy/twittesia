import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// A search costs a query on the index and a read per hit, and someone typing sends one every few
// keystrokes, so this sits well above reading and well below scraping
export const searchRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:search:identity",
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:search:ip",
    limiter: Ratelimit.slidingWindow(180, "1 m"),
  }),
};
