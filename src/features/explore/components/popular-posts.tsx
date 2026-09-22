import { FireIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

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

  return (
    <Feed
      initialPage={data}
      initialSort="popular"
      viewerId={session?.user.id}
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon icon={FireIcon} />
            </EmptyMedia>
            <EmptyTitle>Quiet right now</EmptyTitle>
            <EmptyDescription>
              Nothing is alive to explore. Whatever gets said next shows up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  );
}
