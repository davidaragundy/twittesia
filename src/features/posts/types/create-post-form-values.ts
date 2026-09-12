import type { z } from "zod";

import type { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";

export type CreatePostFormValues = z.infer<typeof createPostFormSchema>;
