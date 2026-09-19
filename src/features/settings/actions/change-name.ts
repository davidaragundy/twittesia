"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

export const changeName = async (
  values: ChangeNameFormValues,
): Promise<ActionResponse<null, BaseActionErrorCode>> => {
  const input = changeNameFormSchema.safeParse(values);

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  // HSET keeps the key's expiry, so renaming never lengthens an identity
  const { error } = await tryCatch(
    redis.hset(toIdentityKey({ id: session.user.id }), { name: input.data.name }),
  );

  if (error)
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't change your name" } };

  return { data: null, error: null };
};
