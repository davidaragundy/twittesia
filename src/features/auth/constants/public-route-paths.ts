// Open to everyone, with or without an identity.
//
// /start mints an identity, so it must be reachable without one. /session-expired must be
// reachable with a session cookie that no longer works, which the proxy can't tell apart from a
// valid one.
export const PUBLIC_ROUTE_PATHS = new Set(["/terms", "/privacy", "/start", "/session-expired"]);
