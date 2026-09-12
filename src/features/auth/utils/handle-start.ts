import "server-only";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";
import { getSession } from "@/features/auth/queries/get-session";

/**
 * The only way in. Mints an identity and sends the visitor to their feed.
 *
 * This is a route handler rather than part of a page because signing in writes a cookie, and a
 * Server Component cannot. It is idempotent: arriving with a session that already works keeps it,
 * so a bookmark or a second tab never replaces the identity someone is already using.
 */
export const handleStart = async (request: Request) => {
  if (await getSession()) return NextResponse.redirect(new URL("/home", request.url));

  // nextCookies() writes the session cookie for us, which is why this is called for its effect
  const { error } = await tryCatch(auth.api.signInAnonymous({ headers: await headers() }));

  if (error) {
    return NextResponse.redirect(new URL("/?error=start", request.url));
  }

  return NextResponse.redirect(new URL("/home", request.url));
};
