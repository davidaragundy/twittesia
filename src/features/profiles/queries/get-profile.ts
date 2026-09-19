import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { readIdentity } from "@/features/auth/utils/read-identity";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import type { Profile } from "@/features/profiles/types/profile";

interface Props {
  username: string;
}

// The identity a handle points at. A handle is stored lower-case, so any case finds it.
export const getProfile = async ({
  username,
}: Props): Promise<ActionResponse<Profile, "USER_NOT_FOUND" | "FAILED_TO_GET_PROFILE">> => {
  const { data: id, error } = await tryCatch(
    redis.get<string>(toHandleKey({ handle: username.toLowerCase() })),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_GET_PROFILE", message: "Couldn't load the profile" },
    };
  }

  const profile = id ? await readIdentity({ id }) : null;

  if (!profile) {
    return { data: null, error: { code: "USER_NOT_FOUND", message: "User not found" } };
  }

  return { data: profile, error: null };
};
