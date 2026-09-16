import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  feed: FeedData | undefined;
  postId: string;
}

export const findFeedPost = ({ feed, postId }: Props): FeedPost | undefined =>
  feed?.pages.flatMap((page) => page.posts).find((item) => item.id === postId);
