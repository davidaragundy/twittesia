"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { SENSITIVE_ACTION_RATE_LIMIT } from "@/features/auth/constants/sensitive-action-rate-limit";
import { auth } from "@/features/auth/lib/auth";
import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { authorizeAction } from "@/features/auth/utils/authorize-action";
import { toActionError } from "@/features/auth/utils/to-action-error";
import { toInvalidInputError } from "@/features/auth/utils/to-invalid-input-error";

export const verifyTwoFactor = async (
  values: TwoFactorFormValues,
): Promise<ActionResponse<null, "INVALID_CODE" | BaseActionErrorCode>> => {
  const input = twoFactorSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "verify-two-factor",
    rateLimit: SENSITIVE_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.verifyTOTP({ body: { code: input.data.code }, headers: await headers() }),
  );

  if (error) return { data: null, error: toActionError(error, ["INVALID_CODE"]) };

  refresh();

  return { data: null, error: null };
};
