"use client";

import { AnonymousIcon, BubbleChatIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DeleteActionsMenu } from "@/shared/components/delete-actions-menu";
import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils/cn";

import { MediaGallery } from "@/features/media/components/media-gallery";
import { PostReactions } from "@/features/posts/components/post-reactions";
import { DELETE_POST_DIALOG_COPY } from "@/features/posts/constants/delete-post-dialog-copy";
import { VIEW_COUNT_FORMAT } from "@/features/posts/constants/view-count-format";
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

  const time = <RelativeTime date={post.createdAt} />;

  return (
    <article
      aria-labelledby={`post-${post.id}-author`}
      aria-posinset={position}
      aria-setsize={total}
      data-view-id={post.isPending ? undefined : post.id}
      data-view-mine={post.isMine}
      className={cn(
        "flex gap-4",
        // On its way: it breathes until it lands, and there is nothing to do to it yet
        post.isPending && "animate-pulse",
      )}
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

      <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-3xl bg-muted/30 px-5 pt-4 pb-3 transition-colors hover:bg-muted/50">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            {author ? (
              <Link
                id={`post-${post.id}-author`}
                href={`/${author.username}`}
                className="truncate font-semibold hover:underline"
              >
                {author.name}
              </Link>
            ) : (
              <span id={`post-${post.id}-author`} className="font-semibold text-muted-foreground">
                Someone who left
              </span>
            )}
            <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              {author && <span className="truncate handle">@{author.displayUsername}</span>}
              {author && <span aria-hidden>·</span>}
              {author ? (
                <Link
                  href={getPostPath({ username: author.username, postId: post.id })}
                  className="shrink-0 hover:text-foreground"
                >
                  {time}
                </Link>
              ) : (
                <span className="shrink-0">{time}</span>
              )}
            </div>
          </div>
          {post.isMine && !post.isPending && (
            <DeleteActionsMenu subject="Post" onDelete={requestDelete} />
          )}
        </header>

        {post.content && (
          <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        <MediaGallery media={post.media} />

        {/* Pulled left by the buttons' own padding, so their icons line up with the text */}
        <footer className="-ml-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {author && (
              <Button
                variant="ghost"
                size="sm"
                disabled={post.isPending}
                aria-label={formatCommentCount(post.commentCount)}
                render={
                  <Link
                    href={`${getPostPath({ username: author.username, postId: post.id })}#comments`}
                  />
                }
                nativeButton={false}
              >
                <HugeiconsIcon icon={BubbleChatIcon} data-icon="inline-start" />
                {post.commentCount}
              </Button>
            )}
            <PostReactions post={post} disabled={post.isPending} />
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  role="img"
                  aria-label={formatViewCount(post.viewCount)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums"
                />
              }
            >
              <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
              {VIEW_COUNT_FORMAT.format(post.viewCount)}
            </TooltipTrigger>
            <TooltipContent>{formatViewCount(post.viewCount)}</TooltipContent>
          </Tooltip>
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
