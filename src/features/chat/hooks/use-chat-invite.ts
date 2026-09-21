import { useEffect, useState } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { readInviteSecret } from "@/features/chat/utils/read-invite-secret";
import { toInviteUrl } from "@/features/chat/utils/to-invite-url";

interface Props {
  chatId: string;
}

// The secret lives in the browser, so the link can only be put together once the page is there.
// Until then it is undefined, which is not the same as gone.
export const useChatInvite = ({ chatId }: Props) => {
  const [invite, setInvite] = useState<string | null | undefined>(undefined);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const secret = readInviteSecret({ chatId });

    setInvite(secret ? toInviteUrl({ id: chatId, secret }) : null);
    setCanShare(typeof navigator.share === "function");
  }, [chatId]);

  // Dismissing the share sheet rejects, which is nothing to report
  const share = async () => {
    if (invite) await tryCatch(navigator.share({ title: "A private chat", url: invite }));
  };

  return { invite, canShare, share };
};
