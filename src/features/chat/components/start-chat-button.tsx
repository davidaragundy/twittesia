"use client";

import { BubbleChatAddIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useStartChatMutation } from "@/features/chat/hooks/use-start-chat-mutation";

interface Props {
  // Quieter where it isn't the page's main action, such as a card beside the feed
  variant?: "default" | "secondary";
  className?: string;
}

export const StartChatButton = ({ variant = "default", className }: Props) => {
  const { mutate, isPending } = useStartChatMutation();

  return (
    <Button variant={variant} className={className} onClick={() => mutate()} disabled={isPending}>
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Icon icon={BubbleChatAddIcon} data-icon="inline-start" />
      )}
      Start a chat
    </Button>
  );
};
