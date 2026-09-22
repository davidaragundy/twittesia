"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
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

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center">
      <SeededAvatar seed={creator.handle} className="size-20" />

      <div className="flex max-w-sm flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isWaiting ? `Waiting for ${creator.name}` : `${creator.name} invited you`}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {isWaiting ? (
            <>
              They see <span className="handle">@{handle}</span> asking to join. This page opens the
              moment they let you in.
            </>
          ) : (
            "A private chat for two. They decide who gets in, and all they will see is your handle."
          )}
        </p>
      </div>

      {isWaiting ? (
        <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <span className="shimmer">Asking to join</span>
        </p>
      ) : (
        <Button size="lg" onClick={() => mutate()} disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          Ask to join
        </Button>
      )}
    </div>
  );
};
