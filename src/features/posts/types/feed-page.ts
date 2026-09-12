import type { FeedPost } from "@/features/posts/types/feed-post";

export type FeedPage = {
  posts: FeedPost[];
  // Passed back to read the page after this one; null once the feed ends
  nextCursor: string | null;
};
