"use client";

import { AnonymousIcon, BubbleChatIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DeleteActionsMenu } from "@/shared/components/delete-actions-menu";
import { Icon } from "@/shared/components/icon";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ViewCount } from "@/shared/components/view-count";
import { cn } from "@/shared/utils/cn";

import { MediaGallery } from "@/features/media/components/media-gallery";
import { PostClock } from "@/features/posts/components/post-clock";
import { PostReactionPicker } from "@/features/posts/components/post-reaction-picker";
import { PostReactions } from "@/features/posts/components/post-reactions";
import { DELETE_POST_DIALOG_COPY } from "@/features/posts/constants/delete-post-dialog-copy";
import { POST_COMMENTS_ANCHOR } from "@/features/posts/constants/post-comments-anchor";
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

  return (
    <article
      aria-labelledby={`post-${post.id}-author`}
      aria-posinset={position}
      aria-setsize={total}
      data-view-id={post.isPending ? undefined : post.id}
      data-view-mine={post.isMine}
      className={cn(
        // Reaches into the margins so its hover can be round without moving the text
        "-mx-4 flex gap-4 rounded-3xl px-4 py-5 transition-colors hover:bg-muted/40",
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
            <Icon icon={AnonymousIcon} />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <header className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
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
            {author ? (
              <Link
                href={getPostPath({ username: author.username, postId: post.id })}
                aria-label="Open this post"
                className="flex shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <PostClock createdAt={post.createdAt} />
              </Link>
            ) : (
              <span className="flex shrink-0 p-1">
                <PostClock createdAt={post.createdAt} />
              </span>
            )}
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

        <PostReactions post={post} disabled={post.isPending} />

        {/* One row that never wraps, pulled left by the buttons' own padding so their icons line
            up with the text */}
        <footer className="-ml-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {author && (
              <Button
                variant="ghost"
                // Square without a number beside the icon, so it sits like the reaction button
                size={post.commentCount ? "sm" : "icon-sm"}
                disabled={post.isPending}
                aria-label={formatCommentCount(post.commentCount)}
                render={
                  <Link
                    href={`${getPostPath({ username: author.username, postId: post.id })}#${POST_COMMENTS_ANCHOR}`}
                  />
                }
                nativeButton={false}
              >
                <Icon icon={BubbleChatIcon} data-icon="inline-start" />
                {!!post.commentCount && post.commentCount}
              </Button>
            )}
            <PostReactionPicker post={post} disabled={post.isPending} />
          </div>
          <ViewCount
            count={post.viewCount ? VIEW_COUNT_FORMAT.format(post.viewCount) : undefined}
            label={formatViewCount(post.viewCount)}
          />
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
