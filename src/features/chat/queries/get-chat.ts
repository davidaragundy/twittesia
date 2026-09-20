import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Chat } from "@/features/chat/types/chat";
import { toChat } from "@/features/chat/utils/to-chat";
import { toChatKey } from "@/features/chat/utils/to-chat-key";

interface Props {
  id: string;
}

// One chat, or null for one that has ended, expired or never existed. Who may read it is the
// caller's to decide: an invite is answered for someone who is not in the chat yet.
export const getChat = async ({ id }: Props): Promise<Chat | null> => {
  const { data, error } = await tryCatch(redis.hgetall(toChatKey({ id })));

  if (error) return null;

  return toChat({ hash: toHashRecord({ reply: data }) });
};
