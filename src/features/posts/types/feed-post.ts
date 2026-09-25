import type { Media } from "@/features/media/types/media";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";
import type { Reaction } from "@/features/posts/types/reaction";

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
  // Set while a post the reader just wrote is still on its way to the store. It is shown, but
  // there is nothing to react to or delete until it lands.
  isPending?: boolean;
  // In the order of POST_REACTION_KEYS, only those at least one user added
  reactions: Reaction[];
  // In the order they were attached
  media: Media[];
  // Users other than the author who saw it
  viewCount: number;
  commentCount: number;
  // How likely its text is to fall in each moderation category, or null if it was never screened
  moderation: ModerationFlags | null;
};
