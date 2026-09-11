// Signed-out visitors only: a session redirects to /home
export const AUTH_ROUTE_PATHS = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
  "/recovery-code",
]);
