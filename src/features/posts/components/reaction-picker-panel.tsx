"use client";

import { cn } from "cn";

import { Button } from "@/shared/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/shared/components/ui/emoji-picker";
import { Separator } from "@/shared/components/ui/separator";

import { QUICK_REACTIONS } from "@/features/posts/constants/quick-reactions";

interface Props {
  mine: Set<string>;
  onSelect: (emoji: string) => void;
  className?: string;
}

export const ReactionPickerPanel = ({ mine, onSelect, className }: Props) => (
  <div className={cn("flex flex-col", className)}>
    <div className="flex items-center justify-between gap-1 p-2">
      {QUICK_REACTIONS.map((emoji) => (
        <Button
          key={emoji}
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-pressed={mine.has(emoji)}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>

    <Separator />
    <EmojiPicker className="h-80 w-full" columns={8} onEmojiSelect={({ emoji }) => onSelect(emoji)}>
      <EmojiPickerSearch placeholder="Search emoji" />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  </div>
);
