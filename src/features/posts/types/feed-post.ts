import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";

// `author` is null only for posts written before ghosts were removed, until they expire
export type FeedPost = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string;
    displayUsername: string;
  } | null;
  // Whether the reader wrote it, and so can delete it
  isMine: boolean;
  // In the order of POST_REACTION_KEYS, only those at least one user added
  reactions: FeedPostReaction[];
  // Users other than the author who saw it
  viewCount: number;
  commentCount: number;
};
