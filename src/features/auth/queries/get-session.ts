import "server-only";

import { headers } from "next/headers";

import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";
import type { Session } from "@/features/auth/types/session";

// Cached in the browser only, per session, so each route's App Shell carries the signed-in UI
// and navigations don't wait for it. Server actions call `refresh()` after a change, which
// clears it. A failed lookup reads as signed out rather than breaking the signed-in layout.
export const getSession = async (): Promise<Session | null> => {
  "use cache: private";

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
};
