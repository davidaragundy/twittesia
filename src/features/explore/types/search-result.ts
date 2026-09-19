import type { ProfileComment } from "@/features/comments/types/profile-comment";
import type { FeedPost } from "@/features/posts/types/feed-post";

// One hit: a post, or a comment that says which post it was left on
export type SearchResult =
  | { kind: "post"; post: FeedPost }
  | { kind: "comment"; comment: ProfileComment };
