import { z } from "zod";

import { authClient } from "@/shared/lib/better-auth/client";

import { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";
import { forgotPasswordFormSchema } from "@/features/auth/schemas/forgot-password-form-schema";
import { magicLinkFormSchema } from "@/features/auth/schemas/magic-link-form-schema";
import { recoveryCodeFormSchema } from "@/features/auth/schemas/recovery-code-form-schema";
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";
import { signUpFormSchema } from "@/features/auth/schemas/sign-up-form-schema";
import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";

export type CredentialsFormValues = z.infer<typeof credentialsFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type MagicLinkFormValues = z.infer<typeof magicLinkFormSchema>;
export type RecoveryCodeFormValues = z.infer<typeof recoveryCodeFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export type Session = typeof authClient.$Infer.Session;

export interface AuthClientError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}
