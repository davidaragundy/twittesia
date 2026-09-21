"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { useEndChatDialog } from "@/features/chat/hooks/use-end-chat-dialog";

interface Props {
  chatId: string;
  // Spelled out where there is room, such as under the invite; an icon in the room's header
  isLabelled?: boolean;
}

// Ends the chat now rather than at its expiry, for everyone in it. Only its creator is shown it.
export const EndChatButton = ({ chatId, isLabelled = false }: Props) => {
  const { isOpen, isPending, onOpenChange, confirm } = useEndChatDialog({ chatId });

  return (
    <>
      {isLabelled ? (
        <Button variant="ghost" onClick={() => onOpenChange(true)}>
          <Icon icon={Delete02Icon} data-icon="inline-start" />
          End this chat
        </Button>
      ) : (
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
            <Icon icon={Delete02Icon} />
          </TooltipTrigger>
          <TooltipContent>End this chat</TooltipContent>
        </Tooltip>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="End this chat?"
        description="It ends right now, for anyone in it, and the invite stops working. It cannot be reopened, and what was said was never written down, so there is nothing else to delete."
        confirmLabel="End it"
        onConfirm={confirm}
        isPending={isPending}
      />
    </>
  );
};
