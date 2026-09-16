"use client";

import { AnonymousIcon, BubbleChatIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DeleteActionsMenu } from "@/shared/components/delete-actions-menu";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";

import { PostReactions } from "@/features/posts/components/post-reactions";
import { DELETE_POST_DIALOG_COPY } from "@/features/posts/constants/delete-post-dialog-copy";
import { POST_DATE_FORMAT } from "@/features/posts/constants/post-date-format";
import { usePostItem } from "@/features/posts/hooks/use-post-item";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { formatCommentCount } from "@/features/posts/utils/format-comment-count";
import { formatViewCount } from "@/features/posts/utils/format-view-count";
import { getPostPath } from "@/features/posts/utils/get-post-path";

interface Props {
  post: FeedPost;
  position: number;
  total: number;
  // Called once the post is deleted, for a page that can't show anything without it
  onDeleted?: () => void;
}

export const PostItem = ({ post, position, total, onDeleted }: Props) => {
  const { isDeleteOpen, onDeleteOpenChange, requestDelete, confirmDelete, isDeleting } =
    usePostItem({ postId: post.id, onDeleted });
  const { author } = post;

  // The clock differs between the server and the browser by a moment
  const time = (
    <time
      dateTime={post.createdAt.toISOString()}
      title={POST_DATE_FORMAT.format(post.createdAt)}
      suppressHydrationWarning
    >
      {formatRelativeTime(post.createdAt)}
    </time>
  );

  return (
    <article
      aria-labelledby={`post-${post.id}-author`}
      aria-posinset={position}
      aria-setsize={total}
      data-view-id={post.id}
      data-view-mine={post.isMine}
      className="flex gap-4 px-4 py-5 sm:px-5"
    >
      {author ? (
        <Link href={`/${author.username}`} className="shrink-0" tabIndex={-1} aria-hidden>
          <SeededAvatar seed={author.username} size="lg" />
        </Link>
      ) : (
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback>
            <HugeiconsIcon icon={AnonymousIcon} className="size-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-2 leading-tight">
            {author ? (
              <Link
                id={`post-${post.id}-author`}
                href={`/${author.username}`}
                className="max-w-[60%] shrink-0 truncate font-semibold hover:underline"
              >
                {author.name}
              </Link>
            ) : (
              <span id={`post-${post.id}-author`} className="font-semibold text-muted-foreground">
                Someone who left
              </span>
            )}
            {author && (
              <span className="min-w-0 truncate [font-feature-settings:'calt'_0] text-sm text-muted-foreground">
                @{author.displayUsername}
              </span>
            )}
            <span aria-hidden className="shrink-0 text-sm text-muted-foreground/60">
              ·
            </span>
            {author ? (
              <Link
                href={getPostPath({ username: author.username, postId: post.id })}
                className="shrink-0 text-sm text-muted-foreground hover:underline"
              >
                {time}
              </Link>
            ) : (
              <span className="shrink-0 text-sm text-muted-foreground">{time}</span>
            )}
          </div>
          {post.isMine && <DeleteActionsMenu subject="Post" onDelete={requestDelete} />}
        </header>

        <p className="text-base leading-relaxed break-words whitespace-pre-wrap">{post.content}</p>

        <footer className="flex flex-wrap items-center justify-between gap-3">
          <PostReactions post={post} />
          <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
            {author && (
              <Link
                href={`${getPostPath({ username: author.username, postId: post.id })}#comments`}
                aria-label={formatCommentCount(post.commentCount)}
                className="flex items-center gap-1.5 rounded-full hover:text-foreground"
              >
                <HugeiconsIcon icon={BubbleChatIcon} className="size-3.5" />
                {post.commentCount}
              </Link>
            )}
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
              {formatViewCount(post.viewCount)}
            </span>
          </div>
        </footer>
      </div>

      {post.isMine && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          title={DELETE_POST_DIALOG_COPY.title}
          description={DELETE_POST_DIALOG_COPY.description}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          isPending={isDeleting}
        />
      )}
    </article>
  );
};
