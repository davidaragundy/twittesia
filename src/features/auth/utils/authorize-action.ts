import type { ActionResponse } from "@/shared/types/action-response";
import type { RateLimitRule } from "@/shared/types/rate-limit-rule";
import { consumeRateLimit } from "@/shared/utils/consume-rate-limit";

import { verifySession } from "@/features/auth/queries/verify-session";

interface Props {
  // Names the action in its rate limit key
  action: string;
  rateLimit: RateLimitRule;
}

type AuthorizedSession = NonNullable<Awaited<ReturnType<typeof verifySession>>>;

// The checks every signed-in action runs first: a valid session, then its rate limit
export const authorizeAction = async ({
  action,
  rateLimit,
}: Props): Promise<
  ActionResponse<AuthorizedSession, "UNAUTHORIZED" | "RATE_LIMITED" | "UNKNOWN">
> => {
  const session = await verifySession();

  if (!session) {
    return { data: null, error: { code: "UNAUTHORIZED", message: "You need to sign in" } };
  }

  const limit = await consumeRateLimit({
    key: `action:${action}:${session.user.id}`,
    rule: rateLimit,
  });

  if (limit === "limited") {
    return {
      data: null,
      error: { code: "RATE_LIMITED", message: "Too many requests, try again later" },
    };
  }

  if (limit === "failed") {
    return { data: null, error: { code: "UNKNOWN", message: "Something went wrong" } };
  }

  return { data: session, error: null };
};
