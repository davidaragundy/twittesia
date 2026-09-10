import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { resolveAuthRouteAccess } from "@/features/auth/utils/resolve-auth-route-access";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "twittesia",
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)"],
};
