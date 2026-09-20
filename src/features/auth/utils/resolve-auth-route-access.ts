import { AUTH_ROUTE_PATHS } from "@/features/auth/constants/auth-route-paths";
import { PUBLIC_ROUTE_PATHS } from "@/features/auth/constants/public-route-paths";

interface Props {
  pathname: string;
  hasSession: boolean;
  // Paths under which everything is open to everyone, for pages whose own address is the only
  // thing identifying them. The caller names them: auth does not know what they are for.
  publicPrefixes?: string[];
}

export const resolveAuthRouteAccess = ({ pathname, hasSession, publicPrefixes = [] }: Props) => {
  const isPublic =
    PUBLIC_ROUTE_PATHS.has(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(`${prefix}/`));

  if (isPublic) {
    return { action: "allow" as const };
  }

  // Without an identity there is nothing to sign in to, so anywhere that needs one sends the
  // visitor to the landing page to start rather than to a form
  if (!hasSession) {
    return AUTH_ROUTE_PATHS.has(pathname)
      ? { action: "allow" as const }
      : { action: "redirect" as const, destination: "/" };
  }

  return AUTH_ROUTE_PATHS.has(pathname)
    ? { action: "redirect" as const, destination: "/home" }
    : { action: "allow" as const };
};
