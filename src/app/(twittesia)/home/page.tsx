import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/shared/components/page-header";
import { TodayDate } from "@/shared/components/today-date";

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
    <div className="flex flex-col gap-10">
      {/* Everything here lasts a day, so the page is about today */}
      <PageHeader eyebrow={<TodayDate />} title="Today" />

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
