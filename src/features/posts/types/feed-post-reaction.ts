import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

export type FeedPostReaction = {
  reaction: PostReactionKey;
  count: number;
  // Whether the reader added this one
  isMine: boolean;
};
