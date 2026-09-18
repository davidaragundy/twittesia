import type { z } from "zod";

import type { createPostSchema } from "@/features/posts/schemas/create-post-schema";

export type CreatePostInput = z.input<typeof createPostSchema>;
