"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";

// Signing out clears the browser's private caches along with the cookie, so nothing
// from this session is shown to whoever signs in next
export const signOut = async (): Promise<ActionResponse<null, "UNKNOWN">> => {
  const { error } = await tryCatch(auth.api.signOut({ headers: await headers() }));

  if (error) {
    return { data: null, error: { code: "UNKNOWN", message: "Failed to sign out" } };
  }

  refresh();
  redirect("/sign-in");
};
