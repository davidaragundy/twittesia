import { useCallback, useRef } from "react";

import { announceTyping } from "@/features/chat/actions/announce-typing";
import { TYPING_PING_MS } from "@/features/chat/constants/typing-ping-ms";

interface Props {
  chatId: string;
}

/**
 * Says that this side is writing, at most every few seconds.
 *
 * Typing is a keystroke at a time and this is not: it says so once, then stays quiet until the
 * gap has passed, so a long message is a handful of these rather than hundreds.
 */
export const useTypingAnnouncer = ({ chatId }: Props) => {
  const last = useRef(0);

  return useCallback(() => {
    const now = Date.now();

    if (now - last.current < TYPING_PING_MS) return;

    last.current = now;

    void announceTyping({ chatId });
  }, [chatId]);
};
