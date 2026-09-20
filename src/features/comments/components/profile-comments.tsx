"use client";

import { SegmentedControl } from "@/shared/components/segmented-control";
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
  const { comments, containerRef, sort, setSort, isPending, isFetchingNextPage, endRef } =
    useProfileComments({ username, initialPage });

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

      {/* The next page is read as this comes into view, so there is nothing to press */}
      <div ref={endRef} aria-hidden className="h-px" />

      {isFetchingNextPage && <Spinner className="self-center" />}
    </div>
  );
};
