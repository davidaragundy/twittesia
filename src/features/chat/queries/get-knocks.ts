import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Knock } from "@/features/chat/types/knock";
import { toKnock } from "@/features/chat/utils/to-knock";
import { toKnocksKey } from "@/features/chat/utils/to-knocks-key";

interface Props {
  chatId: string;
}

// Everyone waiting to be let into a chat, oldest first. Only its creator has any business asking:
// the caller checks that.
export const getKnocks = async ({ chatId }: Props): Promise<Knock[]> => {
  const { data, error } = await tryCatch(redis.hgetall(toKnocksKey({ chatId })));

  if (error) return [];

  const record = toHashRecord({ reply: data });

  if (!record) return [];

  return Object.entries(record)
    .map(([identityId, value]) => toKnock({ identityId, value }))
    .filter((knock) => !!knock)
    .sort((one, other) => one.knockedAt.getTime() - other.knockedAt.getTime());
};
