import { NextResponse } from "next/server";

import { isCronRequest } from "@/shared/utils/is-cron-request";

import { sweepOrphanedMedia } from "@/features/media/utils/sweep-orphaned-media";

// Posts and identities need no purge: they expire in the store by themselves. Files in Blob
// don't, so they are swept.
export const GET = async (request: Request) => {
  if (!isCronRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const media = await sweepOrphanedMedia();

  if (media.error) return NextResponse.json({ message: media.error.message }, { status: 500 });

  return NextResponse.json({ media: media.data });
};
