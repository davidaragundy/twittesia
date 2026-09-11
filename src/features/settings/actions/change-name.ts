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
import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

export const changeName = async (
  values: ChangeNameFormValues,
): Promise<ActionResponse<null, BaseActionErrorCode>> => {
  const input = changeNameFormSchema.safeParse(values);

  if (!input.success) return { data: null, error: toInvalidInputError(input.error) };

  const { error: authorizeError } = await authorizeAction({
    action: "change-name",
    rateLimit: DEFAULT_ACTION_RATE_LIMIT,
  });

  if (authorizeError) return { data: null, error: authorizeError };

  const { error } = await tryCatch(
    auth.api.updateUser({ body: { name: input.data.name }, headers: await headers() }),
  );

  if (error) return { data: null, error: toActionError(error, []) };

  refresh();

  return { data: null, error: null };
};
