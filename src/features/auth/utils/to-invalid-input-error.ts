import type { z } from "zod";

// The error an action returns when its input fails its schema
export const toInvalidInputError = (error: z.ZodError) => ({
  code: "INVALID_INPUT" as const,
  message: error.issues[0]?.message ?? "Invalid input",
});
