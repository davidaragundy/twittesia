import { z } from "zod";

import { VIEW_BATCH_SIZE } from "@/features/posts/constants/view-batch-size";

export const recordViewsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(VIEW_BATCH_SIZE),
});
