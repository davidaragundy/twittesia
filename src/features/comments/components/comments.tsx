"use client";

import { SegmentedControl } from "@/shared/components/segmented-control";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";

import { CommentItem } from "@/features/comments/components/comment-item";
import { COMMENT_SORTS } from "@/features/comments/constants/comment-sorts";
import { useComments } from "@/features/comments/hooks/use-comments";
import type { CommentsPage } from "@/features/comments/types/comments-page";

interface Props {
  postId: string;
  initialPage: CommentsPage;
  // The reader, so their own comments never arrive as news
  viewerId?: string | null;
}

export const Comments = ({ postId, initialPage, viewerId }: Props) => {
  const {
    comments,
    containerRef,
    sort,
    setSort,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    showMore,
  } = useComments({ postId, initialPage, viewerId });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <SegmentedControl
          label="Order comments by"
          options={COMMENT_SORTS}
          value={sort}
          onChange={setSort}
        />
      </div>

      {isPending && <Skeleton className="h-24 w-full rounded-3xl" />}

      {!isPending && !comments.length && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No comments yet. Say something while there&apos;s still time.
        </p>
      )}

      {!isPending && !!comments.length && (
        <div ref={containerRef} className="-mx-4 flex flex-col sm:-mx-5">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <Button
          variant="ghost"
          onClick={showMore}
          disabled={isFetchingNextPage}
          className="self-center rounded-full"
        >
          {isFetchingNextPage && <Spinner data-icon="inline-start" />}
          Show more comments
        </Button>
      )}
    </div>
  );
};
