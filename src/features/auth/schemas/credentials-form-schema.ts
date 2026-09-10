import { z } from "zod";

export const credentialsFormSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(50, {
      message: "Password must be at most 50 characters long",
    }),
});
