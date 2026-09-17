import type { FeedPost } from "@/features/posts/types/feed-post";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { getPostScore } from "@/features/posts/utils/get-post-score";

interface Props {
  post: FeedPost;
  sort: FeedSort;
}

// Points at the last post of a page, in the terms its order was read in: the score leads when the
// feed is read by popularity, and creation then id settle the posts that tie
export const toFeedCursor = ({ post, sort }: Props) =>
  sort === "popular"
    ? `${getPostScore({ post })}_${post.createdAt.toISOString()}_${post.id}`
    : `${post.createdAt.toISOString()}_${post.id}`;
