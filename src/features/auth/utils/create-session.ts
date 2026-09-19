import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { toBase64 } from "@/shared/utils/to-base64";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Identity } from "@/features/auth/types/identity";
import { generateRandomString } from "@/features/auth/utils/generate-random-string";
import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import { hashSecret } from "@/features/auth/utils/hash-secret";
import { toSessionKey } from "@/features/auth/utils/to-session-key";

interface Props {
  identity: Identity;
}

/**
 * A session for an identity, the way Lucia recommends: a token of a random id and a random
 * secret, 120 bits each. The store keeps the id, the identity and the secret's SHA-256, never the
 * secret itself, and forgets all of it when the identity ends.
 */
export const createSession = async ({
  identity,
}: Props): Promise<
  ActionResponse<{ token: string; expiresAt: number }, "FAILED_TO_CREATE_SESSION">
> => {
  const id = generateRandomString();
  const secret = generateRandomString();
  const secretHash = await hashSecret({ secret });
  const expiresAt = getIdentityExpiry({ createdAt: identity.createdAt });
  const key = toSessionKey({ id });

  const { error } = await tryCatch(
    redis
      .multi()
      .hset(key, { identityId: identity.id, secretHash: toBase64({ bytes: secretHash }) })
      .expireat(key, Math.ceil(expiresAt / 1_000))
      .exec(),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_CREATE_SESSION", message: "Couldn't start a session" },
    };
  }

  return { data: { token: `${id}.${secret}`, expiresAt }, error: null };
};
