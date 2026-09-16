"use client";

import { SmileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

import { POST_REACTION_EMOJIS } from "@/features/posts/constants/post-reaction-emojis";
import { POST_REACTION_KEYS } from "@/features/posts/constants/post-reaction-keys";
import { usePostReactionPicker } from "@/features/posts/hooks/use-post-reaction-picker";
import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";
import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

interface Props {
  reactions: FeedPostReaction[];
  onToggle: (reaction: PostReactionKey) => void;
}

export const PostReactionPicker = ({ reactions, onToggle }: Props) => {
  const { isOpen, onOpenChange, select, mine } = usePostReactionPicker({ reactions, onToggle });

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Add reaction"
            title="Add reaction"
          />
        }
      >
        <HugeiconsIcon icon={SmileIcon} />
      </PopoverTrigger>
      <PopoverContent align="start" className="grid w-auto grid-cols-4 gap-1 p-2">
        {POST_REACTION_KEYS.map((reaction) => (
          <Button
            key={reaction}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={POST_REACTION_EMOJIS[reaction].label}
            title={POST_REACTION_EMOJIS[reaction].label}
            aria-pressed={mine.has(reaction)}
            onClick={() => select(reaction)}
            className="text-xl aria-pressed:bg-muted"
          >
            {POST_REACTION_EMOJIS[reaction].emoji}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
