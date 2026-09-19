"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { readIdentity } from "@/features/auth/utils/read-identity";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { rewritePostAuthors } from "@/features/posts/utils/rewrite-post-authors";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

// The new handle is claimed before the old one is let go, with SET NX, so two identities can
// never hold the same one, even when both ask at once. It lives as long as the identity does,
// which its posts may have extended past its first day.
export const changeUsername = async (
  values: ChangeUsernameFormValues,
): Promise<ActionResponse<null, "USERNAME_TAKEN" | BaseActionErrorCode>> => {
  const input = changeUsernameFormSchema.safeParse(values);

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  const session = await getSession();
  const identity = session ? await readIdentity({ id: session.user.id }) : null;

  if (!identity) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const handle = input.data.username;

  if (handle === identity.handle) return { data: null, error: null };

  const failure = {
    data: null,
    error: { code: "UNKNOWN" as const, message: "Couldn't change your username" },
  };

  const { data: secondsLeft, error: ttlError } = await tryCatch(
    redis.ttl(toIdentityKey({ id: identity.id })),
  );

  if (ttlError || secondsLeft <= 0) return failure;

  const { data: claimed, error: claimError } = await tryCatch(
    redis.set(toHandleKey({ handle }), identity.id, { nx: true, ex: secondsLeft }),
  );

  if (claimError) return failure;

  if (claimed !== "OK") {
    return {
      data: null,
      error: { code: "USERNAME_TAKEN", message: "Username is already taken. Please try another." },
    };
  }

  const { error } = await tryCatch(
    redis
      .multi()
      .hset(toIdentityKey({ id: identity.id }), { handle })
      .del(toHandleKey({ handle: identity.handle }))
      .exec(),
  );

  if (error) return failure;

  await rewritePostAuthors({ authorId: identity.id, author: { handle } });

  return { data: null, error: null };
};
