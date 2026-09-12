import type { Metadata } from "next";
import { Suspense } from "react";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";
import { FeedWithFirstPage } from "@/features/posts/components/feed-with-first-page";
import { PostComposer } from "@/features/posts/components/post-composer";

export const metadata: Metadata = {
  title: "Twittesia | Home",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <PostComposer />

      <Suspense fallback={<FeedSkeleton />}>
        <FeedWithFirstPage />
      </Suspense>
    </div>
  );
}
