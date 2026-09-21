"use client";

import { BubbleChatAddIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useStartChatMutation } from "@/features/chat/hooks/use-start-chat-mutation";

export const StartChatButton = () => {
  const { mutate, isPending } = useStartChatMutation();

  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? <Spinner data-icon="inline-start" /> : <Icon icon={BubbleChatAddIcon} />}
      Start a chat
    </Button>
  );
};
