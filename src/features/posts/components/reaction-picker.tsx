"use client";

import { SmileIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/shared/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

import { ReactionPickerPanel } from "@/features/posts/components/reaction-picker-panel";
import { useReactionPicker } from "@/features/posts/hooks/use-reaction-picker";
import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
}

export const ReactionPicker = ({ reactions, onToggle }: Props) => {
  const { isMobile, isOpen, onOpenChange, select, mine } = useReactionPicker({
    reactions,
    onToggle,
  });

  const trigger = (
    <Button
      type="button"
      variant="muted"
      size="icon-sm"
      aria-label="Add reaction"
      title="Add reaction"
      shape="round"
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
          <ReactionPickerPanel mine={mine} onSelect={select} className="pb-4" />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger}>
        <HugeiconsIcon icon={SmileIcon} />
      </PopoverTrigger>
      <PopoverContent align="start" size="none" className="w-auto overflow-hidden">
        <ReactionPickerPanel mine={mine} onSelect={select} />
      </PopoverContent>
    </Popover>
  );
};
