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
import { ItemGroup } from "@/shared/components/ui/item";
import { Spinner } from "@/shared/components/ui/spinner";

import { PostItem } from "@/features/posts/components/post-item";
import { useDeletePostMutation } from "@/features/posts/hooks/use-delete-post-mutation";
import { useFeed } from "@/features/posts/hooks/use-feed";
import type { FeedPage } from "@/features/posts/types/feed-page";

interface Props {
  initialPage: FeedPage;
}

export const Feed = ({ initialPage }: Props) => {
  const { posts, hasNextPage, isFetchingNextPage, endRef } = useFeed({ initialPage });
  const {
    mutate: deletePost,
    isPending: isDeleting,
    variables: deletingId,
  } = useDeletePostMutation();

  if (!posts.length) {
    return (
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
    );
  }

  return (
    <ItemGroup className="gap-8">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onDelete={() => deletePost(post.id)}
          isDeleting={isDeleting && deletingId === post.id}
        />
      ))}

      {/* Scrolling this into view loads the next page */}
      <div ref={endRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && (
          <span className="text-sm text-muted-foreground">That&apos;s everything</span>
        )}
      </div>
    </ItemGroup>
  );
};
