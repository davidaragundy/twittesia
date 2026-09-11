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
import { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";
import type { ChangeEmailFormValues } from "@/features/settings/types/change-email-form-values";

export const changeEmail = async (
  values: ChangeEmailFormValues,
): Promise<ActionResponse<null, BaseActionErrorCode>> => {
  const input = changeEmailFormSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "change-email",
    rateLimit: SENSITIVE_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.changeEmail({
      body: { newEmail: input.data.email, callbackURL: "/home?settings=account" },
      headers: await headers(),
    }),
  );

  if (error) return { data: null, error: toActionError(error, []) };

  refresh();

  return { data: null, error: null };
};
