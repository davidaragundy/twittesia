import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import type { ChatEvent } from "@/features/chat/types/chat-event";
import { toChatChannel } from "@/features/chat/utils/to-chat-channel";

interface Props {
  chatId: string;
  event: ChatEvent;
}

/**
 * Puts one event on a chat's channel, for whoever is listening right now.
 *
 * Nothing is written: a channel keeps nothing, so an event nobody is listening to is gone. That
 * is the behaviour, not a delivery failure — ADR-0003.
 *
 * It is sent as JSON on one line, because what carries it splits on newlines.
 */
export const publishChatEvent = async ({ chatId, event }: Props) => {
  const { error } = await tryCatch(
    redis.publish(toChatChannel({ id: chatId }), JSON.stringify(event)),
  );

  return !error;
};
