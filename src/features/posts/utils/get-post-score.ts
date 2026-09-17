import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
}

// The same score the database orders by, so a cursor points where the order left off
export const getPostScore = ({ post }: Props) =>
  post.reactions.reduce((total, reaction) => total + reaction.count, 0) + post.commentCount;
