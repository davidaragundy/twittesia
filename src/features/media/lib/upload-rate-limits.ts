import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Uploads are what the storage plan counts: the free plan allows 2,000 writes a month, about 66 a
// day, so beyond each identity and network there is one ceiling for everyone, per day.
export const uploadRateLimits: RateLimits = {
  identity: new Ratelimit({
    redis,
    prefix: "ratelimit:upload:identity",
    limiter: Ratelimit.slidingWindow(10, "1 h"),
  }),
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:upload:ip",
    limiter: Ratelimit.fixedWindow(30, "1 d"),
  }),
  everyone: new Ratelimit({
    redis,
    prefix: "ratelimit:upload:everyone",
    limiter: Ratelimit.fixedWindow(60, "1 d"),
  }),
};
