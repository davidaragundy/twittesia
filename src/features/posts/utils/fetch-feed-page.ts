import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedSort } from "@/features/posts/types/feed-sort";

interface Props {
  cursor: string | null;
  sort: FeedSort;
  // An identity, when the feed is one person's posts rather than everyone's
  authorId?: string;
}

type SerializedFeedPage = Omit<FeedPage, "posts"> & {
  posts: (Omit<FeedPage["posts"][number], "createdAt"> & { createdAt: string })[];
};

// JSON has no dates, so the timestamps come back as strings
export const fetchFeedPage = async ({ cursor, sort, authorId }: Props): Promise<FeedPage> => {
  const params = new URLSearchParams({ sort });

  if (cursor) params.set("cursor", cursor);
  if (authorId) params.set("authorId", authorId);

  const response = await fetch(`/api/posts?${params}`);

  if (!response.ok) throw new Error("Couldn't load the feed");

  const page: SerializedFeedPage = await response.json();

  return {
    ...page,
    posts: page.posts.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
};
