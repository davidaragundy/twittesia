import type { InfiniteData } from "@tanstack/react-query";

import type { FeedPage } from "@/features/posts/types/feed-page";

// The feed as TanStack Query caches it under FEED_QUERY_KEY
export type FeedData = InfiniteData<FeedPage, string | null>;
