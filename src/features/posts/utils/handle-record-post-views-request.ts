import "server-only";

import { NextResponse } from "next/server";

import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { recordPostViewsSchema } from "@/features/posts/schemas/record-post-views-schema";
import { recordPostViews } from "@/features/posts/utils/record-post-views";

// A route handler rather than a server action: actions are dispatched one at a time per client,
// and a page that is closing can only reach a URL, through navigator.sendBeacon
export const handleRecordPostViewsRequest = async (request: Request) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { data: body, error: bodyError } = await tryCatch(request.json());
  const input = recordPostViewsSchema.safeParse(bodyError ? null : body);

  if (!input.success) return NextResponse.json({ message: "Invalid views" }, { status: 400 });

  const { error } = await recordPostViews({
    postIds: input.data.postIds,
    viewerId: session.user.id,
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
};
