import type { FeedPage } from "@/features/posts/types/feed-page";

type SerializedFeedPage = Omit<FeedPage, "posts"> & {
  posts: (Omit<FeedPage["posts"][number], "createdAt"> & { createdAt: string })[];
};

// JSON has no dates, so the timestamps come back as strings
export const fetchFeedPage = async (cursor: string | null): Promise<FeedPage> => {
  const response = await fetch(
    cursor ? `/api/posts?cursor=${encodeURIComponent(cursor)}` : "/api/posts",
  );

  if (!response.ok) throw new Error("Couldn't load the feed");

  const page: SerializedFeedPage = await response.json();

  return {
    ...page,
    posts: page.posts.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
};
