import type { z } from "zod";

import type { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";

export type GenerateBackupCodesFormValues = z.infer<typeof generateBackupCodesFormSchema>;
