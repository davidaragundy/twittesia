"use client";

import { SmileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/shared/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

import { PostReactionPickerPanel } from "@/features/posts/components/post-reaction-picker-panel";
import { usePostReactionPicker } from "@/features/posts/hooks/use-post-reaction-picker";
import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";

interface Props {
  reactions: FeedPostReaction[];
  onToggle: (emoji: string) => void;
}

export const PostReactionPicker = ({ reactions, onToggle }: Props) => {
  const { isMobile, isOpen, onOpenChange, select, mine } = usePostReactionPicker({
    reactions,
    onToggle,
  });

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Add reaction"
      title="Add reaction"
      className="rounded-full text-muted-foreground"
    />
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger render={trigger}>
          <HugeiconsIcon icon={SmileIcon} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Add reaction</DrawerTitle>
          <PostReactionPickerPanel mine={mine} onSelect={select} className="pb-4" />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger}>
        <HugeiconsIcon icon={SmileIcon} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-0 overflow-hidden p-0">
        <PostReactionPickerPanel mine={mine} onSelect={select} />
      </PopoverContent>
    </Popover>
  );
};
