"use client";

import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { CommentItem } from "@/features/comments/components/comment-item";
import { useComments } from "@/features/comments/hooks/use-comments";
import type { CommentsPage } from "@/features/comments/types/comments-page";

interface Props {
  postId: string;
  initialPage: CommentsPage;
}

export const Comments = ({ postId, initialPage }: Props) => {
  const { comments, containerRef, hasNextPage, isFetchingNextPage, showMore } = useComments({
    postId,
    initialPage,
  });

  if (!comments.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No comments yet. Say something while there&apos;s still time.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="-mx-4 flex flex-col sm:-mx-5">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

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
