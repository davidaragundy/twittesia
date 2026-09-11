import { isAPIError } from "better-auth/api";

import type { AuthErrorCode } from "@/features/auth/types/auth-error-code";

// Turns what an `auth.api` call threw into an action error. Only the codes the action
// declares pass through; anything else is reported as UNKNOWN.
export const toActionError = <TCode extends AuthErrorCode>(
  error: unknown,
  codes: readonly TCode[],
): { code: TCode | "UNKNOWN"; message: string } => {
  const code = isAPIError(error) ? error.body?.code : undefined;
  const expected = codes.find((item) => item === code);

  if (expected && isAPIError(error)) return { code: expected, message: error.message };

  return { code: "UNKNOWN", message: "Something went wrong" };
};
