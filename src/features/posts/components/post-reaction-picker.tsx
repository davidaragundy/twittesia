"use client";

import { SmileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/shared/components/ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

import { QUICK_REACTIONS } from "@/features/posts/constants/quick-reactions";
import { usePostReactionPicker } from "@/features/posts/hooks/use-post-reaction-picker";
import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";

interface Props {
  reactions: FeedPostReaction[];
  onToggle: (emoji: string) => void;
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
      <PopoverContent align="start" className="w-auto gap-0 overflow-hidden p-0">
        <div className="flex items-center gap-1 border-b border-border/60 p-2">
          {QUICK_REACTIONS.map((emoji) => (
            <Button
              key={emoji}
              type="button"
              variant="ghost"
              size="icon"
              aria-pressed={mine.has(emoji)}
              onClick={() => select(emoji)}
              className="text-xl aria-pressed:bg-muted"
            >
              {emoji}
            </Button>
          ))}
        </div>
        <EmojiPicker className="h-80" columns={8} onEmojiSelect={({ emoji }) => select(emoji)}>
          <EmojiPickerSearch placeholder="Search emoji" />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};
