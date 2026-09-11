import "server-only";

import { headers } from "next/headers";

import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";

// Reads the session fresh from better-auth, never from a cache, so an action authorizes
// against the current state of the account
export const verifySession = async () => {
  const { data } = await tryCatch(auth.api.getSession({ headers: await headers() }));

  return data ?? null;
};
