import { PageHeader } from "@/shared/components/page-header";
import { TodayDate } from "@/shared/components/today-date";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";
import { PostComposerSkeleton } from "@/features/posts/components/post-composer-skeleton";

// The same two skeletons the page streams behind, so arriving and loading look alike
export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      {/* Everything here lasts a day, so the page is about today */}
      <PageHeader eyebrow={<TodayDate />} title="Today" />

      <PostComposerSkeleton />
      <FeedSkeleton />
    </div>
  );
}
