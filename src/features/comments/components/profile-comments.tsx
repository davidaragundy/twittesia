"use client";

import { SegmentedControl } from "@/shared/components/segmented-control";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";

import { ProfileCommentItem } from "@/features/comments/components/profile-comment-item";
import { COMMENT_SORTS } from "@/features/comments/constants/comment-sorts";
import { useProfileComments } from "@/features/comments/hooks/use-profile-comments";
import type { ProfileCommentsPage } from "@/features/comments/types/profile-comments-page";

interface Props {
  username: string;
  displayUsername: string;
  initialPage: ProfileCommentsPage;
}

export const ProfileComments = ({ username, displayUsername, initialPage }: Props) => {
  const {
    comments,
    containerRef,
    sort,
    setSort,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    showMore,
  } = useProfileComments({ username, initialPage });

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
          <span className="handle">@{displayUsername}</span> has no comments left alive.
        </p>
      )}

      {!isPending && !!comments.length && (
        <div ref={containerRef} className="-mx-4 flex flex-col sm:-mx-5">
          {comments.map((comment) => (
            <ProfileCommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <Button
          variant="ghost"
          onClick={showMore}
          disabled={isFetchingNextPage}
          className="self-center"
        >
          {isFetchingNextPage && <Spinner data-icon="inline-start" />}
          Show more comments
        </Button>
      )}
    </div>
  );
};
