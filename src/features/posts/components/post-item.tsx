"use client";

import { AnonymousIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
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
import { getInitials } from "@/shared/utils/get-initials";

import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
  onDelete: () => void;
  isDeleting: boolean;
}

export const PostItem = ({ post, onDelete, isDeleting }: Props) => {
  const { author } = post;

  return (
    <Item className="items-start">
      <ItemMedia>
        {author ? (
          <Avatar>
            <AvatarImage src={author.image ?? undefined} alt={author.name} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
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
