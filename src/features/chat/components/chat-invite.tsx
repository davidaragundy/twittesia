"use client";

import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Label } from "@/shared/components/ui/label";

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
  const { invite } = useChatInvite({ chatId });

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
    <div className="flex flex-col gap-2">
      <Label htmlFor="chat-invite">Send this to one person</Label>
      <CopyToClipboard id="chat-invite" value={invite} />
      <p className="text-xs text-muted-foreground">
        The part after # is the key this chat is encrypted with. It never reaches Twittesia, so only
        whoever holds this link can read the conversation.
      </p>
    </div>
  );
};
