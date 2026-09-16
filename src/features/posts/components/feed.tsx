"use client";

import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Spinner } from "@/shared/components/ui/spinner";

import { PostItem } from "@/features/posts/components/post-item";
import { useFeed } from "@/features/posts/hooks/use-feed";
import { usePostViewTracking } from "@/features/posts/hooks/use-post-view-tracking";
import type { FeedPage } from "@/features/posts/types/feed-page";

interface Props {
  initialPage: FeedPage;
}

export const Feed = ({ initialPage }: Props) => {
  const { posts, postIds, hasNextPage, isFetchingNextPage, endRef } = useFeed({ initialPage });
  const { containerRef } = usePostViewTracking({ postIds });

  if (!posts.length) {
    return (
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
    );
  }

  return (
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
  );
};
