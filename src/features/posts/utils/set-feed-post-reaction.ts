import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
  emoji: string;
  isMine: boolean;
}

// Sets rather than toggles, so applying the same state twice changes nothing. A new emoji goes
// last, where the server will put it, since reactions are ordered by when each was first added.
export const setFeedPostReaction = ({ post, emoji, isMine }: Props): FeedPost => {
  const current = post.reactions.find((item) => item.emoji === emoji);

  if ((current?.isMine ?? false) === isMine) return post;

  const count = (current?.count ?? 0) + (isMine ? 1 : -1);

  if (!current) return { ...post, reactions: [...post.reactions, { emoji, count, isMine }] };

  return {
    ...post,
    reactions:
      count > 0
        ? post.reactions.map((item) => (item.emoji === emoji ? { emoji, count, isMine } : item))
        : post.reactions.filter((item) => item.emoji !== emoji),
  };
};
