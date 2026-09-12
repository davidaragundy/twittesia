import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/features/auth/lib/auth";
import { getSession } from "@/features/auth/queries/get-session";

/**
 * Clears session cookies that no longer point at a valid session, then sends the visitor back to
 * the landing page, where starting again gives them a new identity. There is nothing to recover:
 * an identity that has expired is gone, along with everything it wrote.
 *
 * A valid session is left alone, so a link to this route can't end anyone's identity.
 */
export const handleSessionExpired = async (request: Request) => {
  if (await getSession()) return NextResponse.redirect(new URL("/home", request.url));

  // Names come from better-auth, so they carry the __Secure- prefix wherever it applies
  const { authCookies } = await auth.$context;
  const cookieStore = await cookies();

  for (const cookie of [
    authCookies.sessionToken,
    authCookies.sessionData,
    authCookies.dontRememberToken,
  ]) {
    cookieStore.delete({ name: cookie.name, path: cookie.attributes.path ?? "/" });
  }

  return NextResponse.redirect(new URL("/", request.url));
};
