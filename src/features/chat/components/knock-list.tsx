"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
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
      <h2 id="knock-list-title" className="text-sm font-medium text-muted-foreground">
        Asking to join
      </h2>
      <ItemGroup>
        {knocks.map((knock) => (
          <Item key={knock.identityId} variant="muted">
            <ItemMedia>
              <SeededAvatar seed={knock.handle} className="size-10" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{knock.name}</ItemTitle>
              <ItemDescription>
                <span className="block truncate handle">@{knock.handle}</span>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
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
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </section>
  );
};
