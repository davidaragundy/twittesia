"use client";

import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DeleteActionsMenu } from "@/shared/components/delete-actions-menu";
import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { CommentReactions } from "@/features/comments/components/comment-reactions";
import { DELETE_COMMENT_DIALOG_COPY } from "@/features/comments/constants/delete-comment-dialog-copy";
import { useCommentItem } from "@/features/comments/hooks/use-comment-item";
import type { PostComment } from "@/features/comments/types/post-comment";
import { MediaGallery } from "@/features/media/components/media-gallery";
import { VIEW_COUNT_FORMAT } from "@/features/posts/constants/view-count-format";
import { formatViewCount } from "@/features/posts/utils/format-view-count";

interface Props {
  comment: PostComment;
}

export const CommentItem = ({ comment }: Props) => {
  const { isDeleteOpen, onDeleteOpenChange, requestDelete, confirmDelete, isDeleting } =
    useCommentItem({ postId: comment.postId, commentId: comment.id });
  const { author } = comment;

  return (
    <article
      aria-labelledby={`comment-${comment.id}-author`}
      data-view-id={comment.id}
      data-view-mine={comment.isMine}
      className="flex gap-4"
    >
      <Link href={`/${author.username}`} className="shrink-0" tabIndex={-1} aria-hidden>
        <SeededAvatar seed={author.username} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-3xl bg-muted/30 px-5 pt-4 pb-3 transition-colors hover:bg-muted/50">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <Link
              id={`comment-${comment.id}-author`}
              href={`/${author.username}`}
              className="truncate font-semibold hover:underline"
            >
              {author.name}
            </Link>
            <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <span className="truncate handle">@{author.displayUsername}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0">
                <RelativeTime date={comment.createdAt} />
              </span>
            </div>
          </div>
          {comment.isMine && <DeleteActionsMenu subject="Comment" onDelete={requestDelete} />}
        </header>

        {comment.content && (
          <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        <MediaGallery media={comment.media} />

        {/* Pulled left by the buttons' own padding, so their icons line up with the text */}
        <footer className="-ml-2 flex flex-wrap items-center justify-between gap-2">
          <CommentReactions comment={comment} />
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  role="img"
                  aria-label={formatViewCount(comment.viewCount)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums"
                />
              }
            >
              <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
              {VIEW_COUNT_FORMAT.format(comment.viewCount)}
            </TooltipTrigger>
            <TooltipContent>{formatViewCount(comment.viewCount)}</TooltipContent>
          </Tooltip>
        </footer>
      </div>

      {comment.isMine && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          title={DELETE_COMMENT_DIALOG_COPY.title}
          description={DELETE_COMMENT_DIALOG_COPY.description}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          isPending={isDeleting}
        />
      )}
    </article>
  );
};
