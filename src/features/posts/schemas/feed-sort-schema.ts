import { z } from "zod";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";

// The order a feed request asks for; anything else reads as the default rather than failing
export const feedSortSchema = z.enum(["latest", "popular"]).catch(DEFAULT_FEED_SORT);
