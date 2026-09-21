import { Clock01Icon, FireIcon } from "@hugeicons/core-free-icons";

import type { SortOption } from "@/shared/types/sort-option";

import type { FeedSort } from "@/features/posts/types/feed-sort";

// The orders the feed can be read in, as the menu above it offers them
export const FEED_SORTS: SortOption<FeedSort>[] = [
  { value: "latest", label: "Latest", icon: Clock01Icon },
  { value: "popular", label: "Most popular", icon: FireIcon },
];
