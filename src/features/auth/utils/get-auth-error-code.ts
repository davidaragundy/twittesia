import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { AuthErrorCode } from "@/features/auth/types/auth-error-code";

// The client types `code` as any string; the server only sends codes from `AuthErrorCode`,
// so switching on this result makes a mistyped code fail typecheck
export const getAuthErrorCode = (error: AuthClientError) => error.code as AuthErrorCode | undefined;
