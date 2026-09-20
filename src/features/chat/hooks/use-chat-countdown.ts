import { useEffect, useState } from "react";

import { COUNTDOWN_TICK_MS } from "@/features/chat/constants/countdown-tick-ms";
import { toTimeLeft } from "@/features/chat/utils/to-time-left";

interface Props {
  expiresAt: Date;
}

/**
 * How long the chat has left, worked out in the browser.
 *
 * It starts as null so that the server and the browser agree on the first paint, and the clock
 * only runs here — the server's answer would be a moment stale by the time it arrived.
 */
export const useChatCountdown = ({ expiresAt }: Props) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(toTimeLeft({ expiresAt, now: Date.now() }));

    tick();

    const timer = setInterval(tick, COUNTDOWN_TICK_MS);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return { timeLeft, hasExpired: timeLeft === null };
};
