import type { z } from "zod";

import type { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";

export type ToggleTwoFactorFormValues = z.infer<typeof toggleTwoFactorFormSchema>;
