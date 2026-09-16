import { POST_REACTION_KEYS } from "@/features/posts/constants/post-reaction-keys";
import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";

export const sortPostReactions = (reactions: FeedPostReaction[]): FeedPostReaction[] =>
  reactions.toSorted(
    (a, b) => POST_REACTION_KEYS.indexOf(a.reaction) - POST_REACTION_KEYS.indexOf(b.reaction),
  );
