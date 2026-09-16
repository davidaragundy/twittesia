import "server-only";

import { NextResponse } from "next/server";

import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { recordCommentViews } from "@/features/comments/utils/record-comment-views";
import { recordViewsSchema } from "@/features/posts/schemas/record-views-schema";

// A route handler rather than a server action, for the same reasons as post views: actions are
// dispatched one at a time per client, and a page that is closing can only reach a URL
export const handleRecordCommentViewsRequest = async (request: Request) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { data: body, error: bodyError } = await tryCatch(request.json());
  const input = recordViewsSchema.safeParse(bodyError ? null : body);

  if (!input.success) return NextResponse.json({ message: "Invalid views" }, { status: 400 });

  const { error } = await recordCommentViews({
    commentIds: input.data.ids,
    viewerId: session.user.id,
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
};
