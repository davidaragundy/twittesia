import type { Metadata } from "next";
import { Suspense } from "react";

import { SessionProvider } from "@/features/auth/components/session-provider";
import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";
import { FeedWithFirstPage } from "@/features/posts/components/feed-with-first-page";
import { PostComposer } from "@/features/posts/components/post-composer";
import { PostComposerSkeleton } from "@/features/posts/components/post-composer-skeleton";

export const metadata: Metadata = {
  title: "Twittesia | Home",
};

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
      <Suspense fallback={<PostComposerSkeleton />}>
        <SessionProvider>
          <PostComposer />
        </SessionProvider>
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <FeedWithFirstPage />
      </Suspense>
    </div>
  );
}
