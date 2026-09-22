import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { SESSION_COOKIE_NAME } from "@/features/auth/constants/session-cookie-name";
import type { Session } from "@/features/auth/types/session";
import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import { validateSessionToken } from "@/features/auth/utils/validate-session-token";

// Read per request, never cached across navigations, so a change shows on the next render.
// `cache` shares one lookup between every boundary that asks. Anything that fails reads as
// having no identity rather than breaking the signed-in layout.
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const validated = await validateSessionToken({ token });

  if (!validated) return null;

  const { identity, sessionId } = validated;

  return {
    user: {
      id: identity.id,
      name: identity.name,
      username: identity.handle,
      displayUsername: identity.handle,
      expiresAt: getIdentityExpiry({ createdAt: identity.createdAt }),
    },
    session: { id: sessionId },
  };
});
