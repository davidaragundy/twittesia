import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { toSessionKey } from "@/features/auth/utils/to-session-key";

interface Props {
  id: string;
  handle: string;
  sessionId: string;
}

// The identity, its handle and its session, together: the handle is free again at once
export const deleteIdentity = async ({
  id,
  handle,
  sessionId,
}: Props): Promise<ActionResponse<null, "FAILED_TO_DELETE_IDENTITY">> => {
  const { error } = await tryCatch(
    redis.del(toIdentityKey({ id }), toHandleKey({ handle }), toSessionKey({ id: sessionId })),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_DELETE_IDENTITY", message: "Couldn't end your identity" },
    };
  }

  return { data: null, error: null };
};
