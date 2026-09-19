import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { clearSessionCookie } from "@/features/auth/utils/clear-session-cookie";

/**
 * Clears a session cookie that no longer points at a valid session, then sends the visitor back
 * to the landing page, where starting again gives them a new identity. There is nothing to
 * recover: an identity that has expired is gone, along with everything it wrote.
 *
 * A valid session is left alone, so a link to this route can't end anyone's identity.
 */
export const handleSessionExpired = async (request: Request) => {
  if (await getSession()) return NextResponse.redirect(new URL("/home", request.url));

  await clearSessionCookie();

  return NextResponse.redirect(new URL("/", request.url));
};
