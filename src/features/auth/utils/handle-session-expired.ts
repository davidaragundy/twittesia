import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/features/auth/lib/auth";
import { getSession } from "@/features/auth/queries/get-session";

// Clears session cookies that no longer point at a valid session, then sends the visitor to
// sign in. A valid session is left alone, so a link to this route can't sign anyone out.
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

  return NextResponse.redirect(new URL("/sign-in", request.url));
};
