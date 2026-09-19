import "server-only";

import { redis } from "@/shared/lib/redis/server";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import { toIdentity } from "@/features/auth/utils/to-identity";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";

interface Props {
  id: string;
}

// An identity, or null once it has expired or left, or if the store can't be reached
export const readIdentity = async ({ id }: Props) => {
  const { data } = await tryCatch(redis.hgetall(toIdentityKey({ id })));

  return toIdentity({ hash: toHashRecord({ reply: data }) });
};
