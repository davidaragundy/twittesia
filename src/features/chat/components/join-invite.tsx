"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Spinner } from "@/shared/components/ui/spinner";

import { StartButton } from "@/features/auth/components/start-button";
import { useJoinInvite } from "@/features/chat/hooks/use-join-invite";

interface Props {
  chatId: string;
  creatorName: string;
  creatorHandle: string;
  // Whether someone has already been let in, which spends the invite
  isFull: boolean;
  hasIdentity: boolean;
}

/**
 * The invitation itself.
 *
 * The first thing it does is take the key out of the address bar and keep it in this tab, before
 * anything else can lose it: starting an identity leaves the page, and the key must survive that
 * without ever being sent anywhere.
 */
export const JoinInvite = ({ chatId, creatorName, creatorHandle, isFull, hasIdentity }: Props) => {
  const { chatPath } = useJoinInvite({ chatId, hasIdentity });

  if (isFull) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">This invite is spent</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Someone is already in this chat, and a chat only ever has two people in it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <SeededAvatar seed={creatorHandle} className="size-20" />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{creatorName} invited you</h1>
        <p className="handle text-muted-foreground">@{creatorHandle}</p>
      </div>

      <p className="max-w-md text-sm text-muted-foreground">
        A private chat between the two of you. It lasts a day at most, nothing said in it is ever
        written down, and this link carries the key it is encrypted with.
      </p>

      {hasIdentity ? (
        <Spinner />
      ) : (
        <StartButton returnPath={chatPath} label="Start an identity to join" />
      )}
    </div>
  );
};
