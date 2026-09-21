"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { useEndChatDialog } from "@/features/chat/hooks/use-end-chat-dialog";

interface Props {
  chatId: string;
}

// Ends the chat now rather than at its expiry, for both people at once
export const EndChatButton = ({ chatId }: Props) => {
  const { isOpen, isPending, onOpenChange, confirm } = useEndChatDialog({ chatId });

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="End this chat"
              onClick={() => onOpenChange(true)}
            />
          }
        >
          <HugeiconsIcon icon={Delete02Icon} />
        </TooltipTrigger>
        <TooltipContent>End this chat</TooltipContent>
      </Tooltip>

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="End this chat?"
        description="It goes for both of you, right now, and cannot be reopened. What was said was never written down, so there is nothing else to delete."
        confirmLabel="End it"
        onConfirm={confirm}
        isPending={isPending}
      />
    </>
  );
};
