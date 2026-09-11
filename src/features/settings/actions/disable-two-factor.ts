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
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types/generate-backup-codes-form-values";

export const disableTwoFactor = async (
  values: GenerateBackupCodesFormValues,
): Promise<ActionResponse<null, "INVALID_PASSWORD" | BaseActionErrorCode>> => {
  const input = generateBackupCodesFormSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "disable-two-factor",
    rateLimit: SENSITIVE_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.disableTwoFactor({
      body: { password: input.data.currentPassword },
      headers: await headers(),
    }),
  );

  if (error) return { data: null, error: toActionError(error, ["INVALID_PASSWORD"]) };

  refresh();

  return { data: null, error: null };
};
