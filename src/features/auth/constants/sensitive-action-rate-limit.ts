import type { RateLimitRule } from "@/shared/types/rate-limit-rule";

// Mirrors better-auth's rule for password, email and two-factor changes
export const SENSITIVE_ACTION_RATE_LIMIT: RateLimitRule = { window: 10, max: 3 };
