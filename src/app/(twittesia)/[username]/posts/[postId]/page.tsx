import type { Metadata } from "next";
import { Suspense } from "react";

import { BackButton } from "@/shared/components/back-button";
import { Separator } from "@/shared/components/ui/separator";

import { CommentsSection } from "@/features/comments/components/comments-section";
import { CommentsSkeleton } from "@/features/comments/components/comments-skeleton";
import { PostPage } from "@/features/posts/components/post-page";
import { PostSkeleton } from "@/features/posts/components/post-skeleton";

export const metadata: Metadata = {
  title: "Twittesia | Post",
};

// The post and its comments stream in separately, each behind its own skeleton
export default function PostRoute({ params }: PageProps<"/[username]/posts/[postId]">) {
  return (
    <div className="flex flex-col gap-6">
      <BackButton fallbackHref="/home" label="Back" />

      <Suspense
        fallback={
          // Lined up with the post, which reaches into the page's margins
          <div className="-mx-4 sm:-mx-5">
            <PostSkeleton />
          </div>
        }
      >
        <PostPage params={params} />
      </Suspense>

      <Separator />

      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsSection params={params} />
      </Suspense>
    </div>
  );
}
