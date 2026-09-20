import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { readInviteSecret } from "@/features/chat/utils/read-invite-secret";
import { toChatPath } from "@/features/chat/utils/to-chat-path";

interface Props {
  chatId: string;
  hasIdentity: boolean;
}

/**
 * Keeps the key and gets out of the way.
 *
 * The key is read out of the address bar first, so that it is held in this tab before anything
 * navigates. Someone who already has an identity is then sent straight to the chat; someone who
 * does not starts one, and the same key is waiting when they come back.
 */
export const useJoinInvite = ({ chatId, hasIdentity }: Props) => {
  const router = useRouter();
  const chatPath = toChatPath({ id: chatId });

  useEffect(() => {
    readInviteSecret({ chatId });

    if (hasIdentity) router.replace(chatPath);
  }, [chatId, chatPath, hasIdentity, router]);

  return { chatPath };
};
