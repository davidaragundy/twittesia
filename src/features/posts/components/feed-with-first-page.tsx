import { getSession } from "@/features/auth/queries/get-session";
import { Feed } from "@/features/posts/components/feed";
import { FeedError } from "@/features/posts/components/feed-error";
import { getFeedPage } from "@/features/posts/queries/get-feed-page";

// Reads the first page on the server, so the feed is there on the first paint. It reads the
// request, so render it inside a <Suspense> boundary.
export async function FeedWithFirstPage() {
  const session = await getSession();
  const { data, error } = await getFeedPage({ viewerId: session?.user.id });

  if (error) return <FeedError />;

  return <Feed initialPage={data} />;
}
