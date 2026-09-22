"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Button } from "@/shared/components/ui/button";
import { Marker, MarkerContent, MarkerIcon } from "@/shared/components/ui/marker";
import { Spinner } from "@/shared/components/ui/spinner";

import { useAnswerKnockMutation } from "@/features/chat/hooks/use-answer-knock-mutation";
import type { Knock } from "@/features/chat/types/knock";

interface Props {
  chatId: string;
  knocks: Knock[];
}

/**
 * Who is asking to be let in, for the person who started the chat.
 *
 * There is nothing to go on but a handle, which is the point: letting someone in is a decision
 * about the link, not about who they are. Accepting one drops everyone else.
 */
export const KnockList = ({ chatId, knocks }: Props) => {
  const { mutate, isPending } = useAnswerKnockMutation({ chatId });

  if (!knocks.length) {
    return (
      <Marker role="status" className="justify-center">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>
          <span className="shimmer">Waiting for someone to follow the link</span>
        </MarkerContent>
      </Marker>
    );
  }

  return (
    <section aria-labelledby="knock-list-title" className="flex flex-col gap-4">
      <h2
        id="knock-list-title"
        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        Asking to join
      </h2>
      <div className="flex flex-col gap-3">
        {knocks.map((knock) => (
          <div
            key={knock.identityId}
            className="flex flex-wrap items-center gap-4 rounded-3xl bg-muted/30 p-4 sm:p-5"
          >
            <SeededAvatar seed={knock.handle} className="size-12" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate font-semibold">{knock.name}</p>
              <p className="truncate handle text-sm text-muted-foreground">@{knock.handle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => mutate({ identityId: knock.identityId, accept: false })}
              >
                Turn down
              </Button>
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => mutate({ identityId: knock.identityId, accept: true })}
              >
                Let in
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
