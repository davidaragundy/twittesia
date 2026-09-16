import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { getCommentsPage } from "@/features/comments/queries/get-comments-page";

// The pages of a post's comments the browser asks for after the first
export const handleCommentsRequest = async (
  request: Request,
  { params }: RouteContext<"/api/posts/[postId]/comments">,
) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { postId } = await params;
  const cursor = new URL(request.url).searchParams.get("cursor");
  const { data, error } = await getCommentsPage({ postId, cursor, viewerId: session.user.id });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
