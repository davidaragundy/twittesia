import { getSession } from "@/features/auth/queries/get-session";
import { Feed } from "@/features/posts/components/feed";
import { FeedError } from "@/features/posts/components/feed-error";
import { getFeedPage } from "@/features/posts/queries/get-feed-page";

// What Explore shows before anyone searches: whatever is going on right now, most reacted to and
// most commented on first
export async function PopularPosts() {
  const session = await getSession();
  const { data, error } = await getFeedPage({ sort: "popular", viewerId: session?.user.id });

  if (error) return <FeedError />;

  return <Feed initialPage={data} initialSort="popular" viewerId={session?.user.id} />;
}
