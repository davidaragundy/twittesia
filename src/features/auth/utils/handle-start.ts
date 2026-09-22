import "server-only";

import { NextResponse } from "next/server";

import { isRateLimited } from "@/shared/utils/is-rate-limited";
import { tryCatch } from "@/shared/utils/try-catch";

import { START_ERROR_PARAM } from "@/features/auth/constants/start-error-param";
import { START_RETURN_FIELD } from "@/features/auth/constants/start-return-field";
import { WELCOME_PARAM } from "@/features/auth/constants/welcome-param";
import { startRateLimits } from "@/features/auth/lib/start-rate-limits";
import { getSession } from "@/features/auth/queries/get-session";
import { createIdentity } from "@/features/auth/utils/create-identity";
import { createSession } from "@/features/auth/utils/create-session";
import { setSessionCookie } from "@/features/auth/utils/set-session-cookie";
import { toReturnPath } from "@/features/auth/utils/to-return-path";

/**
 * The only way in. Mints an identity and sends the visitor to their feed.
 *
 * A POST, because it writes: a GET is fetched by things nobody clicked — a link prefetch, a
 * preview, a crawler — and every one of those would hand out an identity. It is a route handler
 * rather than part of a page because it writes a cookie, and a Server Component cannot. It is
 * idempotent: arriving with a session that already works keeps it, so a second tab never
 * replaces the identity someone is already using.
 *
 * A form may ask to land somewhere other than the feed, for someone who was on their way
 * somewhere when they were sent here. Only a path inside Twittesia is followed.
 */
export const handleStart = async (request: Request) => {
  // Anything posting here without a form at all still gets an identity, and lands on the feed
  const { data: form } = await tryCatch(request.formData());
  const destination = toReturnPath({ value: form?.get(START_RETURN_FIELD) ?? null }) ?? "/home";

  // 303, so the browser follows with a GET rather than posting again to where it lands
  if (await getSession()) return NextResponse.redirect(new URL(destination, request.url), 303);

  if (await isRateLimited({ limits: startRateLimits })) {
    return NextResponse.redirect(new URL(`/?${START_ERROR_PARAM}=rate-limited`, request.url), 303);
  }

  const failed = NextResponse.redirect(new URL(`/?${START_ERROR_PARAM}=failed`, request.url), 303);

  const { data: identity, error: identityError } = await createIdentity();

  if (identityError) return failed;

  const { data: session, error: sessionError } = await createSession({ identity });

  if (sessionError) return failed;

  await setSessionCookie(session);

  // Only a new identity is welcomed: the return path never carries a query of its own
  const landing = new URL(destination, request.url);

  landing.searchParams.set(WELCOME_PARAM, "1");

  return NextResponse.redirect(landing, 303);
};
