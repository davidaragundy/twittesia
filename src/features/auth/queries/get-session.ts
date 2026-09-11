import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";

// Deduplicated per request, so every component asking for the session shares one lookup.
// A failed lookup reads as signed out rather than breaking the whole signed-in layout.
export const getSession = cache(async () => {
  const { data, error } = await tryCatch(auth.api.getSession({ headers: await headers() }));

  if (error) return null;

  return data;
});
