// Open to everyone, signed in or not. /session-expired must be reachable with a session cookie
// that no longer works, which the proxy can't tell apart from a valid one.
export const PUBLIC_ROUTE_PATHS = new Set(["/terms", "/privacy", "/session-expired"]);
