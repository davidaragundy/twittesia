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
    <div className="flex flex-wrap items-center gap-2">
      {post.reactions.map(({ emoji, count, isMine }) => (
        <Toggle
          key={emoji}
          variant="outline"
          size="sm"
          pressed={isMine}
          onPressedChange={() => toggle(emoji)}
          aria-label={`${emoji} ${count}`}
          className="h-8 gap-1.5 rounded-full border-border/70 px-3 text-sm tabular-nums hover:bg-muted aria-pressed:border-primary/30 aria-pressed:bg-primary/[0.07] dark:aria-pressed:bg-primary/10"
        >
          <span className="text-base leading-none">{emoji}</span>
          {count}
        </Toggle>
      ))}
      <PostReactionPicker reactions={post.reactions} onToggle={toggle} />
    </div>
  );
};
