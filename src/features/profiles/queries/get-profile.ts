import "server-only";

import { eq } from "drizzle-orm";

import { user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Profile } from "@/features/profiles/types/profile";

interface Props {
  username: string;
}

export const getProfile = async ({
  username,
}: Props): Promise<ActionResponse<Profile, "USER_NOT_FOUND" | "FAILED_TO_GET_PROFILE">> => {
  const { data, error } = await tryCatch(
    db.select().from(user).where(eq(user.username, username)).limit(1),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_GET_PROFILE", message: "Couldn't load the profile" },
    };
  }

  const [profile] = data;

  if (!profile) {
    return { data: null, error: { code: "USER_NOT_FOUND", message: "User not found" } };
  }

  return { data: profile, error: null };
};
