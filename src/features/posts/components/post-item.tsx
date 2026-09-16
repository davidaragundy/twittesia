"use client";

import { AnonymousIcon, Delete02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";

import { PostReactions } from "@/features/posts/components/post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { formatViewCount } from "@/features/posts/utils/format-view-count";

interface Props {
  post: FeedPost;
  onDelete: () => void;
  isDeleting: boolean;
}

export const PostItem = ({ post, onDelete, isDeleting }: Props) => {
  const { author } = post;

  return (
    <Item className="items-start" data-post-id={post.id} data-is-mine={post.isMine}>
      <ItemMedia>
        {author ? (
          <SeededAvatar seed={author.username} />
        ) : (
          <Avatar>
            <AvatarFallback>
              <HugeiconsIcon icon={AnonymousIcon} className="size-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="gap-2">
          {author ? (
            <Link href={`/${author.username}`} className="font-medium hover:underline">
              {author.name}
            </Link>
          ) : (
            <span className="font-medium text-muted-foreground">Someone who left</span>
          )}
          <span className="font-normal text-muted-foreground">
            {author ? `@${author.displayUsername} · ` : ""}
            {/* The clock differs between the server and the browser by a moment */}
            <time dateTime={post.createdAt.toISOString()} suppressHydrationWarning>
              {formatRelativeTime(post.createdAt)}
            </time>
          </span>
        </ItemTitle>
        <ItemDescription className="text-base whitespace-pre-wrap text-foreground">
          {post.content}
        </ItemDescription>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PostReactions post={post} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
            <HugeiconsIcon icon={ViewIcon} className="size-4" />
            {formatViewCount(post.viewCount)}
          </span>
        </div>
      </ItemContent>

      {post.isMine && (
        <ItemActions>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete post"
            title="Delete post"
            disabled={isDeleting}
            onClick={onDelete}
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </Button>
        </ItemActions>
      )}
    </Item>
  );
};
