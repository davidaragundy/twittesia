import "server-only";

import { sql } from "drizzle-orm";

import { rateLimit } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { RateLimitRule } from "@/shared/types/rate-limit-rule";
import { tryCatch } from "@/shared/utils/try-catch";

interface Props {
  key: string;
  rule: RateLimitRule;
}

// Counts one request against a fixed window kept in `rate_limit`, in a single atomic upsert:
// the first request after a window ends starts a new one at 1.
export const consumeRateLimit = async ({ key, rule }: Props) => {
  const now = Date.now();
  const windowStart = now - rule.window * 1_000;

  const { data, error } = await tryCatch(
    db
      .insert(rateLimit)
      .values({ id: crypto.randomUUID(), key, count: 1, lastRequest: now })
      .onConflictDoUpdate({
        target: rateLimit.key,
        set: {
          count: sql`case when ${rateLimit.lastRequest} < ${windowStart} then 1 else ${rateLimit.count} + 1 end`,
          lastRequest: sql`case when ${rateLimit.lastRequest} < ${windowStart} then ${now} else ${rateLimit.lastRequest} end`,
        },
      })
      .returning({ count: rateLimit.count }),
  );

  // Without a count there is no way to tell, so the request is refused rather than let through
  if (error) return "failed" as const;

  return data[0].count > rule.max ? ("limited" as const) : ("allowed" as const);
};
