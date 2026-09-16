import type { FeedData } from "@/features/posts/types/feed-data";

interface Props {
  feed: FeedData | undefined;
  postId: string;
}

export const removeFeedPost = ({ feed, postId }: Props): FeedData | undefined =>
  feed && {
    ...feed,
    pages: feed.pages.map((page) => ({
      ...page,
      posts: page.posts.filter((item) => item.id !== postId),
    })),
  };
