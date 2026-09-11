import type { z } from "zod";

import type { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
