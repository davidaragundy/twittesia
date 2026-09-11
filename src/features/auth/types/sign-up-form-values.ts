import type { z } from "zod";

import type { signUpFormSchema } from "@/features/auth/schemas/sign-up-form-schema";

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
