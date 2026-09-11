import { AUTH_ROUTE_PATHS } from "@/features/auth/constants/auth-route-paths";
import { PUBLIC_ROUTE_PATHS } from "@/features/auth/constants/public-route-paths";

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
