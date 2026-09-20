import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Chat } from "@/features/chat/types/chat";
import { toChat } from "@/features/chat/utils/to-chat";
import { toChatKey } from "@/features/chat/utils/to-chat-key";
import { toChatsKey } from "@/features/chat/utils/to-chats-key";

interface Props {
  identityId: string;
}

/**
 * The chats one identity is in, newest first.
 *
 * A chat ends by expiring, which tells the list nothing, so an id whose chat has gone is simply
 * read as gone and left out: the list is not what keeps chats alive.
 */
export const getChats = async ({ identityId }: Props): Promise<Chat[]> => {
  const { data: ids, error } = await tryCatch(
    redis.zrange<string[]>(toChatsKey({ identityId }), 0, -1, { rev: true }),
  );

  if (error || !ids.length) return [];

  const pipeline = redis.pipeline();

  for (const id of ids) pipeline.hgetall(toChatKey({ id }));

  const { data: replies, error: readError } = await tryCatch(pipeline.exec());

  if (readError) return [];

  return replies.map((reply) => toChat({ hash: toHashRecord({ reply }) })).filter((chat) => !!chat);
};
