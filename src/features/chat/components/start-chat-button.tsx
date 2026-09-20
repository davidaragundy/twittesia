"use client";

import { BubbleChatAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useStartChatMutation } from "@/features/chat/hooks/use-start-chat-mutation";

export const StartChatButton = () => {
  const { mutate, isPending } = useStartChatMutation();

  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <HugeiconsIcon icon={BubbleChatAddIcon} />
      )}
      Start a chat
    </Button>
  );
};
