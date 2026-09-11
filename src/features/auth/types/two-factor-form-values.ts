import type { z } from "zod";

import type { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";

export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;
