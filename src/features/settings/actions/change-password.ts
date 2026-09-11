"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { SENSITIVE_ACTION_RATE_LIMIT } from "@/features/auth/constants/sensitive-action-rate-limit";
import { auth } from "@/features/auth/lib/auth";
import { authorizeAction } from "@/features/auth/utils/authorize-action";
import { toActionError } from "@/features/auth/utils/to-action-error";
import { toInvalidInputError } from "@/features/auth/utils/to-invalid-input-error";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types/change-password-form-values";

export const changePassword = async (
  values: ChangePasswordFormValues,
): Promise<
  ActionResponse<null, "INVALID_PASSWORD" | "PASSWORD_COMPROMISED" | BaseActionErrorCode>
> => {
  const input = changePasswordFormSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "change-password",
    rateLimit: SENSITIVE_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.changePassword({
      body: {
        currentPassword: input.data.currentPassword,
        newPassword: input.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    }),
  );

  if (error)
    return {
      data: null,
      error: toActionError(error, ["INVALID_PASSWORD", "PASSWORD_COMPROMISED"]),
    };

  refresh();

  return { data: null, error: null };
};
