import { TOO_MANY_REQUESTS_STATUS } from "@/shared/constants/too-many-requests-status";

import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { AuthErrorCode } from "@/features/auth/types/auth-error-code";

type Handlers = Partial<Record<AuthErrorCode, () => void>> & {
  // Runs for any code without a handler of its own, including errors that carry none
  fallback: () => void;
};

// The one place an `authClient` error is dispatched. A 429 has no code and is already shown by
// the client's global handler, so it runs nothing here. Handler keys are typed to the codes the
// auth server can return, so a mistyped code fails typecheck.
export const handleAuthError = (error: AuthClientError, handlers: Handlers) => {
  if (error.status === TOO_MANY_REQUESTS_STATUS) return;

  // The client types `code` as any string; the server only sends codes from `AuthErrorCode`
  const code = error.code as AuthErrorCode | undefined;
  const handler = code ? handlers[code] : undefined;

  (handler ?? handlers.fallback)();
};
