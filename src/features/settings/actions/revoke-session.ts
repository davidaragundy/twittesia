"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { DEFAULT_ACTION_RATE_LIMIT } from "@/features/auth/constants/default-action-rate-limit";
import { auth } from "@/features/auth/lib/auth";
import { authorizeAction } from "@/features/auth/utils/authorize-action";
import { toActionError } from "@/features/auth/utils/to-action-error";
import { toInvalidInputError } from "@/features/auth/utils/to-invalid-input-error";

// The browser only knows session ids; the token that revokes one is looked up here,
// among the caller's own sessions, so no token ever leaves the server
export const revokeSession = async (
  sessionId: string,
): Promise<ActionResponse<null, "SESSION_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = z.string().min(1).safeParse(sessionId);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "revoke-session",
    rateLimit: DEFAULT_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const requestHeaders = await headers();

  const { data: sessions, error: listError } = await tryCatch(
    auth.api.listSessions({ headers: requestHeaders }),
  );

  if (listError) return { data: null, error: toActionError(listError, []) };

  const target = sessions.find((item) => item.id === input.data);

  if (!target) {
    return {
      data: null,
      error: { code: "SESSION_NOT_FOUND", message: "That session is already closed" },
    };
  }

  const { error } = await tryCatch(
    auth.api.revokeSession({ body: { token: target.token }, headers: requestHeaders }),
  );

  if (error) return { data: null, error: toActionError(error, []) };

  refresh();

  return { data: null, error: null };
};
