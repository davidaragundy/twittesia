"use client";

import { Alert01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChatInvite } from "@/features/chat/hooks/use-chat-invite";

interface Props {
  chatId: string;
}

/**
 * The link that lets one person in, for the person who started the chat.
 *
 * Half of it is the secret this tab is holding. Close the tab and that half is gone, so the link
 * cannot be shown again: what it unlocks was never on a server to look up.
 */
export const ChatInvite = ({ chatId }: Props) => {
  const { invite, canShare, share } = useChatInvite({ chatId });

  if (invite === undefined) return <Skeleton className="h-52 w-full" />;

  if (!invite) {
    return (
      <Alert>
        <HugeiconsIcon icon={Alert01Icon} />
        <AlertTitle>The key is gone from this tab</AlertTitle>
        <AlertDescription>
          The link cannot be shown again. Start another chat to get a new one.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section
      aria-labelledby="chat-invite-title"
      className="flex flex-col gap-6 rounded-3xl bg-muted/30 p-6"
    >
      <div className="flex flex-col gap-2">
        <h1 id="chat-invite-title" className="text-xl font-semibold tracking-tight">
          Invite one person
        </h1>
        <p className="text-sm text-muted-foreground">
          Send them this link. The part after # is the key the chat is encrypted with: it never
          reaches Twittesia, so only whoever holds the link can read what you say.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="chat-invite" className="sr-only">
          Invite link
        </label>
        <CopyToClipboard id="chat-invite" value={invite} />
        {canShare && (
          <Button variant="secondary" onClick={share}>
            <HugeiconsIcon icon={Share08Icon} data-icon="inline-start" />
            Share link
          </Button>
        )}
      </div>
    </section>
  );
};
