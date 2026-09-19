import "server-only";

import { setSessionCookie } from "@/features/auth/utils/set-session-cookie";

// Removes the cookie by overwriting it with one that has already expired
export const clearSessionCookie = () => setSessionCookie({ token: "", expiresAt: 0 });
