import { z } from "zod";

export const changeUsernameFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(30, {
      message: "Username must be at most 30 characters long",
    })
    // Hyphens are allowed because every generated handle has two
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username should only contain letters, numbers, hyphens and underscores",
    })
    // One handle whatever its case, so a profile's address never depends on how it was typed
    .toLowerCase(),
});
