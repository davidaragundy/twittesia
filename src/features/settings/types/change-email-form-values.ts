import type { z } from "zod";

import type { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";

export type ChangeEmailFormValues = z.infer<typeof changeEmailFormSchema>;
