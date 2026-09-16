"use client";

import { Button } from "@/shared/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/shared/components/ui/emoji-picker";
import { cn } from "@/shared/utils/cn";

import { QUICK_REACTIONS } from "@/features/posts/constants/quick-reactions";

interface Props {
  mine: Set<string>;
  onSelect: (emoji: string) => void;
  className?: string;
}

export const ReactionPickerPanel = ({ mine, onSelect, className }: Props) => (
  <div className={cn("flex flex-col", className)}>
    <div className="flex items-center justify-between gap-1 border-b border-border/60 p-2">
      {QUICK_REACTIONS.map((emoji) => (
        <Button
          key={emoji}
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-pressed={mine.has(emoji)}
          onClick={() => onSelect(emoji)}
          className="rounded-2xl text-2xl aria-pressed:bg-muted"
        >
          {emoji}
        </Button>
      ))}
    </div>
    <EmojiPicker className="h-80 w-full" columns={8} onEmojiSelect={({ emoji }) => onSelect(emoji)}>
      <EmojiPickerSearch placeholder="Search emoji" />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  </div>
);
