import type { Metadata } from "next";
import { Suspense } from "react";

import { ExplorePage } from "@/features/explore/components/explore-page";
import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

export const metadata: Metadata = {
  title: "Twittesia | Explore",
};

export default function ExploreRoute({ searchParams }: PageProps<"/explore">) {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <ExplorePage searchParams={searchParams} />
    </Suspense>
  );
}
