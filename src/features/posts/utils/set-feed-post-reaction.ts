import type { FeedPost } from "@/features/posts/types/feed-post";
import { setReaction } from "@/features/posts/utils/set-reaction";

interface Props {
  post: FeedPost;
  emoji: string;
  isMine: boolean;
}

export const setFeedPostReaction = ({ post, emoji, isMine }: Props): FeedPost => {
  const reactions = setReaction({ reactions: post.reactions, emoji, isMine });

  return reactions === post.reactions ? post : { ...post, reactions };
};
