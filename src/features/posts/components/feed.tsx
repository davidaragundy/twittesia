"use client";

import { ArrowUp01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SegmentedControl } from "@/shared/components/segmented-control";
import { Button } from "@/shared/components/ui/button";
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
import type { FeedSort } from "@/features/posts/types/feed-sort";

interface Props {
  initialPage: FeedPage;
  // An identity, when the feed is one person's posts rather than everyone's
  authorId?: string;
  // What to show when there is nothing to read, for a feed whose emptiness means something else
  empty?: React.ReactNode;
  // The order the first page was read in, for a feed that doesn't start with the usual one
  initialSort?: FeedSort;
  // The reader, so their own posts never arrive as news
  viewerId?: string | null;
}

export const Feed = ({ initialPage, authorId, empty, initialSort, viewerId }: Props) => {
  const {
    posts,
    postIds,
    sort,
    setSort,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    endRef,
    newPostCount,
    showNewPosts,
  } = useFeed({ initialPage, authorId, initialSort, viewerId });
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

      {/* Offered rather than shown: nothing moves under the reader until they ask for it */}
      {!!newPostCount && (
        <Button variant="secondary" className="self-center" onClick={showNewPosts}>
          <HugeiconsIcon icon={ArrowUp01Icon} />
          {newPostCount === 1 ? "1 new post" : `${newPostCount} new posts`}
        </Button>
      )}

      {isPending && <FeedSkeleton />}

      {!isPending &&
        !posts.length &&
        (empty ?? (
          <Empty>
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
            className="flex flex-col gap-3"
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
