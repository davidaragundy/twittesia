import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_PREFIX } from "@/features/auth/constants/auth-cookie-prefix";
import { resolveAuthRouteAccess } from "@/features/auth/utils/resolve-auth-route-access";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  });

  const decision = resolveAuthRouteAccess({
    pathname: request.nextUrl.pathname,
    hasSession: Boolean(sessionCookie),
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
