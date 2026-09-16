"use client";

import { AnonymousIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";

import { DeletePostDialog } from "@/features/posts/components/delete-post-dialog";
import { PostActionsMenu } from "@/features/posts/components/post-actions-menu";
import { PostReactions } from "@/features/posts/components/post-reactions";
import { POST_DATE_FORMAT } from "@/features/posts/constants/post-date-format";
import { usePostItem } from "@/features/posts/hooks/use-post-item";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { formatViewCount } from "@/features/posts/utils/format-view-count";

interface Props {
  post: FeedPost;
  position: number;
  total: number;
}

export const PostItem = ({ post, position, total }: Props) => {
  const { isDeleteOpen, onDeleteOpenChange, requestDelete, confirmDelete, isDeleting } =
    usePostItem({ postId: post.id });
  const { author } = post;

  return (
    <article
      aria-labelledby={`post-${post.id}-author`}
      aria-posinset={position}
      aria-setsize={total}
      data-post-id={post.id}
      data-is-mine={post.isMine}
      className="flex gap-4 rounded-4xl px-4 py-5 transition-colors hover:bg-muted/40 sm:px-5"
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
            {/* The clock differs between the server and the browser by a moment */}
            <time
              dateTime={post.createdAt.toISOString()}
              title={POST_DATE_FORMAT.format(post.createdAt)}
              suppressHydrationWarning
              className="shrink-0 text-sm text-muted-foreground"
            >
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>
          {post.isMine && <PostActionsMenu onDelete={requestDelete} />}
        </header>

        <p className="text-base leading-relaxed break-words whitespace-pre-wrap">{post.content}</p>

        <footer className="flex flex-wrap items-center justify-between gap-3">
          <PostReactions post={post} />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
            <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
            {formatViewCount(post.viewCount)}
          </span>
        </footer>
      </div>

      {post.isMine && (
        <DeletePostDialog
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </article>
  );
};
