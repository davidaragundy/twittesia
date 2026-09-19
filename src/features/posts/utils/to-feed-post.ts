import type { Media } from "@/features/media/types/media";
import type { FeedPost } from "@/features/posts/types/feed-post";
import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  // A post hash as a record of strings, exactly as HGETALL returns it
  hash: Record<string, string> | null | undefined;
  // The reader, so the post knows whether they wrote it
  viewerId?: string | null;
}

// Everything the feed and a post's page show of a post, or null for anything that isn't one
export const toFeedPost = ({ hash, viewerId }: Props): FeedPost | null => {
  if (!hash || hash.type !== "post" || !hash.id) return null;

  return {
    id: hash.id,
    content: hash.content ?? "",
    createdAt: new Date(Number(hash.createdAt)),
    author: {
      name: hash.authorName ?? "",
      username: hash.authorHandle ?? "",
      displayUsername: hash.authorHandle ?? "",
    },
    isMine: !!viewerId && hash.authorId === viewerId,
    // Written only by the app, as JSON, in the order each emoji was first added
    reactions: JSON.parse(hash.reactions || "[]") as Reaction[],
    media: JSON.parse(hash.media || "[]") as Media[],
    viewCount: Number(hash.viewCount ?? 0),
    commentCount: Number(hash.commentCount ?? 0),
  };
};
