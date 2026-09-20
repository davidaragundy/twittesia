import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/features/auth/constants/session-cookie-name";
import { resolveAuthRouteAccess } from "@/features/auth/utils/resolve-auth-route-access";
import { JOIN_PATH } from "@/features/chat/constants/join-path";

export function proxy(request: NextRequest) {
  // Only whether the cookie is there: the session behind it is checked where it is read, since a
  // check here would cost a store lookup on every request, assets and prefetches included
  const decision = resolveAuthRouteAccess({
    pathname: request.nextUrl.pathname,
    hasSession: request.cookies.has(SESSION_COOKIE_NAME),
    // An invite is followed by people who have never been here, and the page behind it is the
    // one thing a chat shows someone who is not in it
    publicPrefixes: [JOIN_PATH],
  });

  if (decision.action === "allow") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(decision.destination, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_vercel|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|sitemap.xml|robots.txt|images).*)",
  ],
};
