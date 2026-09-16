import type { FeedData } from "@/features/posts/types/feed-data";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  feed: FeedData | undefined;
  postId: string;
  update: (post: FeedPost) => FeedPost;
}

export const updateFeedPost = ({ feed, postId, update }: Props): FeedData | undefined =>
  feed && {
    ...feed,
    pages: feed.pages.map((page) => ({
      ...page,
      posts: page.posts.map((item) => (item.id === postId ? update(item) : item)),
    })),
  };
