// The landing page, which only someone without an identity has any reason to see: an identity
// redirects to /home. It is the one route in this set, and the set exists so that it stays one
// idea rather than a bare string comparison in the proxy.
export const AUTH_ROUTE_PATHS = new Set(["/"]);
