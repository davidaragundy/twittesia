"use client";

import { Toggle } from "@/shared/components/ui/toggle";

import { PostReactionPicker } from "@/features/posts/components/post-reaction-picker";
import { POST_REACTION_EMOJIS } from "@/features/posts/constants/post-reaction-emojis";
import { usePostReactions } from "@/features/posts/hooks/use-post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
}

export const PostReactions = ({ post }: Props) => {
  const { toggle } = usePostReactions({ postId: post.id });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {post.reactions.map(({ reaction, count, isMine }) => (
        <Toggle
          key={reaction}
          variant="outline"
          size="sm"
          pressed={isMine}
          onPressedChange={() => toggle(reaction)}
          aria-label={`${POST_REACTION_EMOJIS[reaction].label}, ${count}`}
          className="gap-1.5 px-2.5 aria-pressed:border-primary/40 aria-pressed:bg-primary/10"
        >
          <span>{POST_REACTION_EMOJIS[reaction].emoji}</span>
          <span className="tabular-nums">{count}</span>
        </Toggle>
      ))}
      <PostReactionPicker reactions={post.reactions} onToggle={toggle} />
    </div>
  );
};
