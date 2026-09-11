import type { z } from "zod";

import type { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";

export type CredentialsFormValues = z.infer<typeof credentialsFormSchema>;
