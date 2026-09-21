"use client";

import Link from "next/link";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DeleteActionsMenu } from "@/shared/components/delete-actions-menu";
import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { ViewCount } from "@/shared/components/view-count";

import { CommentReactionPicker } from "@/features/comments/components/comment-reaction-picker";
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
      // Reaches into the margins so its hover can be round without moving the text
      className="-mx-4 flex gap-3 rounded-3xl px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <Link href={`/${author.username}`} className="shrink-0" tabIndex={-1} aria-hidden>
        <SeededAvatar seed={author.username} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <header className="flex min-h-8 items-center gap-3">
          <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
            <Link
              id={`comment-${comment.id}-author`}
              href={`/${author.username}`}
              className="truncate font-semibold hover:underline"
            >
              {author.name}
            </Link>
            <span aria-hidden className="text-sm text-muted-foreground">
              ·
            </span>
            <span className="shrink-0 text-sm text-muted-foreground">
              <RelativeTime date={comment.createdAt} />
            </span>
          </div>
          {comment.isMine && <DeleteActionsMenu subject="Comment" onDelete={requestDelete} />}
        </header>

        {comment.content && (
          <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        <MediaGallery media={comment.media} />

        <CommentReactions comment={comment} />

        {/* One row that never wraps, pulled left by the buttons' own padding so their icons line
            up with the text */}
        <footer className="-ml-2 flex items-center justify-between gap-2">
          <CommentReactionPicker comment={comment} />
          <ViewCount
            count={VIEW_COUNT_FORMAT.format(comment.viewCount)}
            label={formatViewCount(comment.viewCount)}
          />
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
