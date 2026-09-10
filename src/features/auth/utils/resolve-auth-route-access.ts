// Signed-out visitors only: a session redirects to /home
const AUTH_ROUTE_PATHS = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
  "/recovery-code",
]);

const PUBLIC_ROUTE_PATHS = new Set(["/terms", "/privacy"]);

interface Props {
  pathname: string;
  hasSession: boolean;
}

export const resolveAuthRouteAccess = ({ pathname, hasSession }: Props) => {
  const isPublicRoute = PUBLIC_ROUTE_PATHS.has(pathname);
  const isAuthRoute = AUTH_ROUTE_PATHS.has(pathname);

  if (isPublicRoute) {
    return { action: "allow" as const };
  }

  if (!hasSession) {
    return isAuthRoute
      ? { action: "allow" as const }
      : { action: "redirect" as const, destination: "/sign-in" };
  }

  return isAuthRoute
    ? { action: "redirect" as const, destination: "/home" }
    : { action: "allow" as const };
};
