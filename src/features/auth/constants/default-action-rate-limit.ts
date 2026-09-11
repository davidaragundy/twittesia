import type { RateLimitRule } from "@/shared/types/rate-limit-rule";

// Mirrors better-auth's default rule, which its server API doesn't apply to server actions
export const DEFAULT_ACTION_RATE_LIMIT: RateLimitRule = { window: 10, max: 100 };
