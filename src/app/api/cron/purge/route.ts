import { NextResponse } from "next/server";

import { isCronRequest } from "@/shared/utils/is-cron-request";

import { sweepDueMedia } from "@/features/media/utils/sweep-due-media";

// Everything in the store expires by itself. Files in Blob don't, so the ones due are swept.
export const GET = async (request: Request) => {
  if (!isCronRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const media = await sweepDueMedia();

  if (media.error) return NextResponse.json({ message: media.error.message }, { status: 500 });

  return NextResponse.json({ media: media.data });
};
