import "server-only";

import { NextResponse } from "next/server";

import { redis } from "@/shared/lib/redis/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { getProfileCommentsPage } from "@/features/comments/queries/get-profile-comments-page";
import { commentSortSchema } from "@/features/comments/schemas/comment-sort-schema";

// The pages of one person's comments the browser asks for after the first
export const handleProfileCommentsRequest = async (
  request: Request,
  { params }: RouteContext<"/api/profiles/[username]/comments">,
) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { username } = await params;
  const { data: authorId, error: handleError } = await tryCatch(
    redis.get<string>(toHandleKey({ handle: username.toLowerCase() })),
  );

  if (handleError)
    return NextResponse.json({ message: "Couldn't load the comments" }, { status: 500 });

  // A handle that has expired or left has no comments left to show
  if (!authorId) return NextResponse.json({ comments: [], nextCursor: null });

  const { searchParams } = new URL(request.url);
  const { data, error } = await getProfileCommentsPage({
    authorId,
    cursor: searchParams.get("cursor"),
    sort: commentSortSchema.parse(searchParams.get("sort")),
    viewerId: session.user.id,
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
