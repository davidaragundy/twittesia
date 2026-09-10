"use server";

import { eq, or } from "drizzle-orm";

import { user } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import { tryCatch } from "@/shared/utils/try-catch";

import type { FeatureActionResponse, Profile } from "@/features/profile/types";

interface Props {
  id?: string;
  username?: string;
}

export const getProfile = async ({
  id,
  username,
}: Props): Promise<FeatureActionResponse<Profile>> => {
  if (!id && !username) {
    return {
      error: {
        message: "Either id or username is required",
      },
    };
  }

  const { data, error } = await tryCatch(
    db
      .select()
      .from(user)
      .where(or(eq(user.id, id ?? ""), eq(user.username, username ?? "")))
      .limit(1),
  );

  if (error) {
    return {
      error: {
        message: "Something went wrong while fetching the user data",
      },
    };
  }

  if (!data || data.length === 0) {
    return {
      error: {
        message: "User not found",
      },
    };
  }

  return {
    data: data[0],
  };
};
