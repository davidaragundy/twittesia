import "server-only";

import { NextResponse } from "next/server";

import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { START_ERROR_PARAM } from "@/features/auth/constants/start-error-param";
import { startRateLimits } from "@/features/auth/lib/start-rate-limits";
import { getSession } from "@/features/auth/queries/get-session";
import { createIdentity } from "@/features/auth/utils/create-identity";
import { createSession } from "@/features/auth/utils/create-session";
import { setSessionCookie } from "@/features/auth/utils/set-session-cookie";

/**
 * The only way in. Mints an identity and sends the visitor to their feed.
 *
 * A POST, because it writes: a GET is fetched by things nobody clicked — a link prefetch, a
 * preview, a crawler — and every one of those would hand out an identity. It is a route handler
 * rather than part of a page because it writes a cookie, and a Server Component cannot. It is
 * idempotent: arriving with a session that already works keeps it, so a second tab never
 * replaces the identity someone is already using.
 */
export const handleStart = async (request: Request) => {
  // 303, so the browser follows with a GET rather than posting again to where it lands
  if (await getSession()) return NextResponse.redirect(new URL("/home", request.url), 303);

  if (await isRateLimited({ limits: startRateLimits })) {
    return NextResponse.redirect(new URL(`/?${START_ERROR_PARAM}=rate-limited`, request.url), 303);
  }

  const failed = NextResponse.redirect(new URL(`/?${START_ERROR_PARAM}=failed`, request.url), 303);

  const { data: identity, error: identityError } = await createIdentity();

  if (identityError) return failed;

  const { data: session, error: sessionError } = await createSession({ identity });

  if (sessionError) return failed;

  await setSessionCookie(session);

  return NextResponse.redirect(new URL("/home", request.url), 303);
};
