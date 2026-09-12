import { NextResponse } from "next/server";

import { isCronRequest } from "@/shared/utils/is-cron-request";

import { purgeExpiredIdentities } from "@/features/auth/utils/purge-expired-identities";
import { purgeExpiredPosts } from "@/features/posts/utils/purge-expired-posts";

// Posts first, then identities: an identity is only removed once it has no posts left, so
// clearing expired posts in the same run lets the identities behind them go on the same pass.
export const GET = async (request: Request) => {
  if (!isCronRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const posts = await purgeExpiredPosts();

  if (posts.error) return NextResponse.json({ message: posts.error.message }, { status: 500 });

  const identities = await purgeExpiredIdentities();

  if (identities.error) {
    return NextResponse.json({ message: identities.error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts.data, identities: identities.data });
};
