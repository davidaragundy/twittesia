import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { getFeedPage } from "@/features/posts/queries/get-feed-page";

// The feed pages the browser asks for as it scrolls. It reads the session itself, so a signed-out
// request gets nothing.
export const handleFeedRequest = async (request: Request) => {
  const session = await getSession();

  if (!session) return NextResponse.json({ message: "You need to sign in" }, { status: 401 });

  const cursor = new URL(request.url).searchParams.get("cursor");
  const { data, error } = await getFeedPage({ cursor, viewerId: session.user.id });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
