import type { auth } from "@/features/auth/lib/auth";

// Every code the auth server can answer with: better-auth's and its plugins'
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES;
