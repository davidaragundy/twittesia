import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  feed: FeedData | undefined;
  post: FeedPost;
}

export const prependFeedPost = ({ feed, post }: Props): FeedData | undefined =>
  feed && {
    ...feed,
    pages: feed.pages.map((page, index) =>
      index === 0 ? { ...page, posts: [post, ...page.posts] } : page,
    ),
  };
