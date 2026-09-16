import { z } from "zod";

import { POST_VIEW_BATCH_SIZE } from "@/features/posts/constants/post-view-batch-size";

export const recordPostViewsSchema = z.object({
  postIds: z.array(z.string().min(1)).min(1).max(POST_VIEW_BATCH_SIZE),
});
