"use client";

import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SegmentedControl } from "@/shared/components/segmented-control";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Spinner } from "@/shared/components/ui/spinner";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";
import { PostItem } from "@/features/posts/components/post-item";
import { FEED_SORTS } from "@/features/posts/constants/feed-sorts";
import { POST_VIEWS_URL } from "@/features/posts/constants/post-views-url";
import { useFeed } from "@/features/posts/hooks/use-feed";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";
import type { FeedPage } from "@/features/posts/types/feed-page";

interface Props {
  initialPage: FeedPage;
  // A handle, when the feed is one person's posts rather than everyone's
  author?: string;
  // What to show when there is nothing to read, for a feed whose emptiness means something else
  empty?: React.ReactNode;
}

export const Feed = ({ initialPage, author, empty }: Props) => {
  const { posts, postIds, sort, setSort, isPending, hasNextPage, isFetchingNextPage, endRef } =
    useFeed({ initialPage, author });
  const { containerRef } = useViewTracking({ ids: postIds, url: POST_VIEWS_URL });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <SegmentedControl
          label="Order posts by"
          options={FEED_SORTS}
          value={sort}
          onChange={setSort}
        />
      </div>

      {isPending && <FeedSkeleton />}

      {!isPending &&
        !posts.length &&
        (empty ?? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Home01Icon} />
              </EmptyMedia>
              <EmptyTitle>Nothing here yet</EmptyTitle>
              <EmptyDescription>
                Posts show up here for the 24 hours they live. Write the first one.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ))}

      {!isPending && !!posts.length && (
        <div className="flex flex-col gap-2">
          <div
            ref={containerRef}
            role="feed"
            aria-label="Posts"
            aria-busy={isFetchingNextPage}
            className="-mx-4 flex flex-col gap-1 sm:-mx-5"
          >
            {posts.map((post, index) => (
              <PostItem
                key={post.id}
                post={post}
                position={index + 1}
                total={hasNextPage ? -1 : posts.length}
              />
            ))}
          </div>

          {/* Scrolling this into view loads the next page */}
          <div ref={endRef} className="flex justify-center py-8">
            {isFetchingNextPage && <Spinner />}
            {!hasNextPage && (
              <span className="text-sm text-muted-foreground">That&apos;s everything</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
