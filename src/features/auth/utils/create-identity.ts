import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { MAX_HANDLE_ATTEMPTS } from "@/features/auth/constants/max-handle-attempts";
import type { Identity } from "@/features/auth/types/identity";
import { generateHandle } from "@/features/auth/utils/generate-handle";
import { generateRandomString } from "@/features/auth/utils/generate-random-string";
import { getDisplayName } from "@/features/auth/utils/get-display-name";
import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";

// A new identity with a generated handle and name, and nothing else: nobody gives anything to
// make one. The handle is claimed first, with SET NX, so two identities can never share one.
export const createIdentity = async (): Promise<
  ActionResponse<Identity, "FAILED_TO_CREATE_IDENTITY">
> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_CREATE_IDENTITY" as const, message: "Couldn't start an identity" },
  };

  const id = generateRandomString();
  const createdAt = Date.now();
  const expiresAt = Math.ceil(getIdentityExpiry({ createdAt }) / 1_000);

  let handle: string | null = null;

  for (let attempt = 0; attempt < MAX_HANDLE_ATTEMPTS && !handle; attempt++) {
    const candidate = generateHandle();
    const { data: claimed, error } = await tryCatch(
      redis.set(toHandleKey({ handle: candidate }), id, { nx: true, exat: expiresAt }),
    );

    if (error) return failure;
    if (claimed === "OK") handle = candidate;
  }

  if (!handle) return failure;

  const identity: Identity = { id, handle, name: getDisplayName({ handle }), createdAt };
  const key = toIdentityKey({ id });

  const { error } = await tryCatch(
    redis
      .multi()
      .hset(key, { ...identity, createdAt: String(createdAt) })
      .expireat(key, expiresAt)
      .exec(),
  );

  if (error) return failure;

  return { data: identity, error: null };
};
