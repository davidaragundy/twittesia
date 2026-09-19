import type { Ratelimit } from "@upstash/ratelimit";

// The limits one kind of request is held to: per identity, per network, and for everyone at once
export type RateLimits = {
  identity?: Ratelimit;
  ip?: Ratelimit;
  everyone?: Ratelimit;
};
