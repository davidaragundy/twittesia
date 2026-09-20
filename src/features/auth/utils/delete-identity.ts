import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { toSessionKey } from "@/features/auth/utils/to-session-key";

interface Props {
  id: string;
  sessionId: string;
}

/**
 * Ends an identity and the session it was using.
 *
 * Its handle is left where it is, to expire on its own. Every post and comment carries a copy of
 * the handle that wrote it, and those outlive the identity, so a handle freed now could be given
 * to someone new while older posts still show it as theirs.
 */
export const deleteIdentity = async ({
  id,
  sessionId,
}: Props): Promise<ActionResponse<null, "FAILED_TO_DELETE_IDENTITY">> => {
  const { error } = await tryCatch(
    redis.del(toIdentityKey({ id }), toSessionKey({ id: sessionId })),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_DELETE_IDENTITY", message: "Couldn't end your identity" },
    };
  }

  return { data: null, error: null };
};
