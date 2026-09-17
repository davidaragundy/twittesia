import type { FeedSort } from "@/features/posts/types/feed-sort";

// The orders the feed can be read in, as the switch above it offers them
export const FEED_SORTS: { value: FeedSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most popular" },
];
