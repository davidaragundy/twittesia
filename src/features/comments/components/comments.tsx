"use client";

import { SegmentedControl } from "@/shared/components/segmented-control";
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
  const { comments, containerRef, sort, setSort, isPending, isFetchingNextPage, endRef } =
    useComments({ postId, initialPage, viewerId });

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

      {isPending && <Skeleton className="h-24 w-full" />}

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

      {/* The next page is read as this comes into view, so there is nothing to press */}
      <div ref={endRef} aria-hidden className="h-px" />

      {isFetchingNextPage && <Spinner className="self-center" />}
    </div>
  );
};
