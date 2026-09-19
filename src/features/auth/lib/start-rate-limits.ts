import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/shared/lib/redis/server";
import type { RateLimits } from "@/shared/types/rate-limits";

// Identities cost nothing to make, so every other limit is only as good as this one. Per network,
// with room for a household or an office starting together.
export const startRateLimits: RateLimits = {
  ip: new Ratelimit({
    redis,
    prefix: "ratelimit:start:ip",
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  }),
};
