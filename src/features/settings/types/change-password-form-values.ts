import type { z } from "zod";

import type { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
