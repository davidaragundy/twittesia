"use client";

import { SmileIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/shared/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { ReactionPickerPanel } from "@/features/posts/components/reaction-picker-panel";
import { useReactionPicker } from "@/features/posts/hooks/use-reaction-picker";
import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
  disabled?: boolean;
}

export const ReactionPicker = ({ reactions, onToggle, disabled }: Props) => {
  const { isMobile, isOpen, onOpenChange, select, mine } = useReactionPicker({
    reactions,
    onToggle,
  });

  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Add reaction"
      disabled={disabled}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger render={button}>
          <Icon icon={SmileIcon} />
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
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={button} />}>
          <Icon icon={SmileIcon} />
        </TooltipTrigger>
        <TooltipContent>Add reaction</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-auto overflow-hidden">
        <ReactionPickerPanel mine={mine} onSelect={select} />
      </PopoverContent>
    </Popover>
  );
};
