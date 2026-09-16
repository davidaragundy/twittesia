"use client";

import { Toggle } from "@/shared/components/ui/toggle";

import { PostReactionPicker } from "@/features/posts/components/post-reaction-picker";
import { usePostReactions } from "@/features/posts/hooks/use-post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
}

export const PostReactions = ({ post }: Props) => {
  const { toggle } = usePostReactions({ postId: post.id });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {post.reactions.map(({ emoji, count, isMine }) => (
        <Toggle
          key={emoji}
          variant="outline"
          size="sm"
          pressed={isMine}
          onPressedChange={() => toggle(emoji)}
          aria-label={`${emoji} ${count}`}
          className="gap-1.5 px-2.5 aria-pressed:border-primary/40 aria-pressed:bg-primary/10"
        >
          <span>{emoji}</span>
          <span className="tabular-nums">{count}</span>
        </Toggle>
      ))}
      <PostReactionPicker reactions={post.reactions} onToggle={toggle} />
    </div>
  );
};
