import "server-only";

import type { RateLimits } from "@/shared/types/rate-limits";
import { getClientIp } from "@/shared/utils/get-client-ip";
import { tryCatch } from "@/shared/utils/try-catch";

interface Props {
  limits: RateLimits;
  // Who is asking, for the per-identity limit
  identityId?: string;
}

/**
 * Whether a request is over any of its limits. Every limit counts the request, so going over one
 * still uses up the others.
 *
 * A limit that cannot be checked lets the request through, as a timeout does in the SDK: a slow
 * or unreachable Redis shouldn't stop anyone posting, and everything after this needs Redis anyway.
 */
export const isRateLimited = async ({ limits, identityId }: Props) => {
  const checks = [
    limits.identity && identityId ? limits.identity.limit(identityId) : null,
    limits.ip ? getClientIp().then((ip) => limits.ip?.limit(ip)) : null,
    limits.everyone ? limits.everyone.limit("everyone") : null,
  ];

  const { data: results, error } = await tryCatch(Promise.all(checks));

  if (error) return false;

  return results.some((result) => result && !result.success);
};
