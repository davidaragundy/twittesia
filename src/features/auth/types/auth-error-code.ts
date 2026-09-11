import type { AUTH_EMAIL_ERROR_CODES } from "@/features/auth/constants/auth-email-error-codes";
import type { auth } from "@/features/auth/lib/auth";

// Every code the auth server can answer with: better-auth's and its plugins', plus our email senders'
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES | keyof typeof AUTH_EMAIL_ERROR_CODES;
