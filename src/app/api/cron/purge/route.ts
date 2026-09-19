import { NextResponse } from "next/server";

import { isCronRequest } from "@/shared/utils/is-cron-request";

import { sweepOrphanedMedia } from "@/features/media/utils/sweep-orphaned-media";
import { purgeExpiredPosts } from "@/features/posts/utils/purge-expired-posts";

// Posts first, then media, because expired posts leave files behind with nothing to belong to.
// Identities need no purge: they expire in the store by themselves.
export const GET = async (request: Request) => {
  if (!isCronRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const posts = await purgeExpiredPosts();

  if (posts.error) return NextResponse.json({ message: posts.error.message }, { status: 500 });

  const media = await sweepOrphanedMedia();

  if (media.error) return NextResponse.json({ message: media.error.message }, { status: 500 });

  return NextResponse.json({ posts: posts.data, media: media.data });
};
