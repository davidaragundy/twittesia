import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { getFeedPage } from "@/features/posts/queries/get-feed-page";
import { feedSortSchema } from "@/features/posts/schemas/feed-sort-schema";

// The feed pages the browser asks for as it scrolls. It reads the session itself, so a signed-out
// request gets nothing.
export const handleFeedRequest = async (request: Request) => {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sort = feedSortSchema.parse(searchParams.get("sort"));
  const { data, error } = await getFeedPage({
    cursor: searchParams.get("cursor"),
    sort,
    viewerId: session.user.id,
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
