import type { FeedPost } from "@/features/posts/types/feed-post";
import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";
import { sortPostReactions } from "@/features/posts/utils/sort-post-reactions";

interface Props {
  post: FeedPost;
  reaction: PostReactionKey;
  isMine: boolean;
}

// Sets rather than toggles, so applying the same state twice changes nothing
export const setFeedPostReaction = ({ post, reaction, isMine }: Props): FeedPost => {
  const current = post.reactions.find((item) => item.reaction === reaction);

  if ((current?.isMine ?? false) === isMine) return post;

  const count = (current?.count ?? 0) + (isMine ? 1 : -1);
  const others = post.reactions.filter((item) => item.reaction !== reaction);
  const reactions = count > 0 ? [...others, { reaction, count, isMine }] : others;

  return { ...post, reactions: sortPostReactions(reactions) };
};
