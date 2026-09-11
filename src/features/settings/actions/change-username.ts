"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { DEFAULT_ACTION_RATE_LIMIT } from "@/features/auth/constants/default-action-rate-limit";
import { auth } from "@/features/auth/lib/auth";
import { authorizeAction } from "@/features/auth/utils/authorize-action";
import { toActionError } from "@/features/auth/utils/to-action-error";
import { toInvalidInputError } from "@/features/auth/utils/to-invalid-input-error";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

export const changeUsername = async (
  values: ChangeUsernameFormValues,
): Promise<ActionResponse<null, "USERNAME_IS_ALREADY_TAKEN" | BaseActionErrorCode>> => {
  const input = changeUsernameFormSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "change-username",
    rateLimit: DEFAULT_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.updateUser({
      body: { username: input.data.username, displayUsername: input.data.username },
      headers: await headers(),
    }),
  );

  if (error) return { data: null, error: toActionError(error, ["USERNAME_IS_ALREADY_TAKEN"]) };

  refresh();

  return { data: null, error: null };
};
