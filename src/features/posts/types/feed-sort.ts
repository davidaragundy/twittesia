import type { z } from "zod";

import type { feedSortSchema } from "@/features/posts/schemas/feed-sort-schema";

export type FeedSort = z.infer<typeof feedSortSchema>;
