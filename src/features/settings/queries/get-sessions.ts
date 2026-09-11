import "server-only";

import { headers } from "next/headers";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { auth } from "@/features/auth/lib/auth";
import type { ActiveSession } from "@/features/settings/types/active-session";

// Never throws, so the settings dialog can offer a retry instead of an error screen
export const getSessions = async (): Promise<
  ActionResponse<ActiveSession[], "FAILED_TO_LIST_SESSIONS">
> => {
  const { data, error } = await tryCatch(auth.api.listSessions({ headers: await headers() }));

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LIST_SESSIONS", message: "Couldn't load your active sessions" },
    };
  }

  return { data, error: null };
};
