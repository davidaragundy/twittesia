import type { PostComment } from "@/features/comments/types/post-comment";
import type { Media } from "@/features/media/types/media";
import { toModerationFlags } from "@/features/moderation/utils/to-moderation-flags";
import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  // A comment hash as a record of strings, exactly as HGETALL returns it
  hash: Record<string, string> | null | undefined;
  // The reader, so the comment knows whether they wrote it
  viewerId?: string | null;
  // The emoji the reader added to it
  mine?: string[];
}

// Everything a post's page shows of a comment, or null for anything that isn't one
export const toPostComment = ({ hash, viewerId, mine = [] }: Props): PostComment | null => {
  if (!hash || hash.type !== "comment" || !hash.id || !hash.postId) return null;

  return {
    id: hash.id,
    postId: hash.postId,
    content: hash.content ?? "",
    createdAt: new Date(Number(hash.createdAt)),
    author: {
      name: hash.authorName ?? "",
      username: hash.authorHandle ?? "",
      displayUsername: hash.authorHandle ?? "",
    },
    isMine: !!viewerId && hash.authorId === viewerId,
    // Written only by the app, as JSON, in the order each emoji was first added
    reactions: (JSON.parse(hash.reactions || "[]") as Omit<Reaction, "isMine">[]).map(
      (reaction) => ({ ...reaction, isMine: mine.includes(reaction.emoji) }),
    ),
    media: JSON.parse(hash.media || "[]") as Media[],
    viewCount: Number(hash.viewCount ?? 0),
    moderation: toModerationFlags({ value: hash.moderation }),
  };
};
