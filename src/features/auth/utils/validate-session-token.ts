import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { constantTimeEqual } from "@/shared/utils/constant-time-equal";
import { fromBase64 } from "@/shared/utils/from-base64";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Identity } from "@/features/auth/types/identity";
import { hashSecret } from "@/features/auth/utils/hash-secret";
import { readIdentity } from "@/features/auth/utils/read-identity";
import { toSessionKey } from "@/features/auth/utils/to-session-key";

interface Props {
  token: string;
}

/**
 * The identity behind a session token, or null for a token that is malformed, unknown, expired,
 * or whose secret doesn't match. The secret is compared by its hash in constant time, so a guess
 * learns nothing from how long the answer takes.
 */
export const validateSessionToken = async ({
  token,
}: Props): Promise<{ sessionId: string; identity: Identity } | null> => {
  const [id, secret, ...rest] = token.split(".");

  if (!id || !secret || rest.length) return null;

  const { data } = await tryCatch(redis.hgetall(toSessionKey({ id })));
  const record = toHashRecord({ reply: data });

  if (!record?.identityId || !record.secretHash) return null;

  const isMatch = constantTimeEqual({
    a: await hashSecret({ secret }),
    b: fromBase64({ value: record.secretHash }),
  });

  if (!isMatch) return null;

  const identity = await readIdentity({ id: record.identityId });

  return identity ? { sessionId: id, identity } : null;
};
