import type { z } from "zod";

import type { forgotPasswordFormSchema } from "@/features/auth/schemas/forgot-password-form-schema";

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
