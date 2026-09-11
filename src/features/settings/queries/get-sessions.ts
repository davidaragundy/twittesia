import "server-only";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";

// Resolves to null instead of throwing, so the settings dialog can offer a retry
export const getSessions = async () => {
  try {
    return await auth.api.listSessions({ headers: await headers() });
  } catch {
    return null;
  }
};
