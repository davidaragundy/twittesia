"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";

import { getSession } from "@/features/auth/queries/get-session";
import { clearSessionCookie } from "@/features/auth/utils/clear-session-cookie";
import { deleteIdentity } from "@/features/auth/utils/delete-identity";

// Ends the identity now rather than at its expiry: its handle, name and session are gone, and
// the cookie with them
export const leave = async (): Promise<
  ActionResponse<null, "FAILED_TO_DELETE_IDENTITY" | BaseActionErrorCode>
> => {
  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const { error } = await deleteIdentity({
    id: session.user.id,
    handle: session.user.username,
    sessionId: session.session.id,
  });

  if (error) return { data: null, error };

  await clearSessionCookie();

  return { data: null, error: null };
};
