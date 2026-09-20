import { useEffect, useState } from "react";

import { readInviteSecret } from "@/features/chat/utils/read-invite-secret";
import { toInviteUrl } from "@/features/chat/utils/to-invite-url";

interface Props {
  chatId: string;
}

// The secret lives in the browser, so the link can only be put together once the page is there
export const useChatInvite = ({ chatId }: Props) => {
  const [invite, setInvite] = useState<string | null>(null);

  useEffect(() => {
    const secret = readInviteSecret({ chatId });

    setInvite(secret ? toInviteUrl({ id: chatId, secret }) : null);
  }, [chatId]);

  return { invite };
};
