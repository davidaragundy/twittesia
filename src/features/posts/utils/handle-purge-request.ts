import "server-only";

import { NextResponse } from "next/server";

import { purgeExpiredPosts } from "@/features/posts/utils/purge-expired-posts";

// Vercel sends CRON_SECRET as a bearer token when it runs the job, which is what tells this
// request apart from anyone else's
export const handlePurgeRequest = async (request: Request) => {
  const secret = process.env.CRON_SECRET;

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await purgeExpiredPosts();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
