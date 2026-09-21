"use client";

import { SortMenu } from "@/shared/components/sort-menu";
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
  // Where the reader writes one, under the heading, when they can
  composer?: React.ReactNode;
}

export const Comments = ({ postId, initialPage, viewerId, composer }: Props) => {
  const { comments, containerRef, sort, setSort, isPending, isFetchingNextPage, endRef } =
    useComments({ postId, initialPage, viewerId });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="comments-title" className="text-lg font-semibold tracking-tight">
          Comments
        </h2>
        <SortMenu label="Sort comments" options={COMMENT_SORTS} value={sort} onChange={setSort} />
      </div>

      {composer}

      {isPending && <Skeleton className="h-24 w-full" />}

      {!isPending && !comments.length && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No comments yet. Say something while there&apos;s still time.
        </p>
      )}

      {!isPending && !!comments.length && (
        <div ref={containerRef} className="flex flex-col gap-1">
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
