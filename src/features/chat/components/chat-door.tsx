"use client";

import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useKnockMutation } from "@/features/chat/hooks/use-knock-mutation";
import type { ChatParticipant } from "@/features/chat/types/chat-participant";

interface Props {
  chatId: string;
  creator: ChatParticipant;
  handle: string;
  isWaiting: boolean;
}

// What someone who followed an invite sees: who is on the other side, and one thing to do
export const ChatDoor = ({ chatId, creator, handle, isWaiting }: Props) => {
  const { mutate, isPending } = useKnockMutation({ chatId });

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Spinner />
        <p className="font-medium">Waiting for {creator.name}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          They see <span className="handle">@{handle}</span> asking to join. This page opens the
          moment they let you in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="max-w-sm text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{creator.name}</span> invited one person to a
        private chat. They decide who, and all they will see is your handle.
      </p>

      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending && <Spinner data-icon="inline-start" />}
        Ask to join as @{handle}
      </Button>
    </div>
  );
};
