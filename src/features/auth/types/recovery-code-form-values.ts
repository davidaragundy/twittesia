import type { z } from "zod";

import type { recoveryCodeFormSchema } from "@/features/auth/schemas/recovery-code-form-schema";

export type RecoveryCodeFormValues = z.infer<typeof recoveryCodeFormSchema>;
