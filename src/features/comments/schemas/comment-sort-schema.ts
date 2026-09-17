import { z } from "zod";

import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";

// The order a comments request asks for; anything else reads as the default rather than failing
export const commentSortSchema = z.enum(["latest", "popular"]).catch(DEFAULT_COMMENT_SORT);
