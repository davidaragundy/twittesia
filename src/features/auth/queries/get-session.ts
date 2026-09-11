import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";
import type { Session } from "@/features/auth/types/session";

// Read per request, never cached across navigations, so a change made through `authClient`
// shows on the next render. `cache` shares one lookup between every boundary that asks.
// A failed lookup reads as signed out rather than breaking the signed-in layout.
export const getSession = cache(async (): Promise<Session | null> => {
  const { data, error } = await tryCatch(auth.api.getSession({ headers: await headers() }));

  if (error || !data) return null;

  const { user, session } = data;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      displayUsername: user.displayUsername,
      twoFactorEnabled: user.twoFactorEnabled,
    },
    session: { id: session.id },
  };
});
