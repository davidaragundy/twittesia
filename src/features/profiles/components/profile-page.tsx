import { NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { notFound } from "next/navigation";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

import { getSession } from "@/features/auth/queries/get-session";
import { ProfileComments } from "@/features/comments/components/profile-comments";
import { getProfileCommentsPage } from "@/features/comments/queries/get-profile-comments-page";
import { Feed } from "@/features/posts/components/feed";
import { getFeedPage } from "@/features/posts/queries/get-feed-page";
import { ProfileCounts } from "@/features/profiles/components/profile-counts";
import { ProfileHeader } from "@/features/profiles/components/profile-header";
import { ProfileTabs } from "@/features/profiles/components/profile-tabs";
import { getProfile } from "@/features/profiles/queries/get-profile";
import { getProfileStats } from "@/features/profiles/queries/get-profile-stats";

interface Props {
  username: string;
}

export const ProfilePage = async ({ username }: Props) => {
  const { data: profile, error } = await getProfile({ username });

  if (error?.code === "USER_NOT_FOUND") notFound();

  // Any other failure goes to the route's error boundary, which offers a retry
  if (error) throw new Error(error.message);

  const session = await getSession();
  const viewerId = session?.user.id;
  const handle = profile.username ?? username;

  const [stats, posts, comments] = await Promise.all([
    getProfileStats({ userId: profile.id }),
    getFeedPage({ author: handle, viewerId }),
    getProfileCommentsPage({ username: handle, viewerId }),
  ]);

  return (
    <div className="flex flex-col gap-12 py-4">
      <ProfileHeader profile={profile} />

      {stats.data && <ProfileCounts stats={stats.data} />}

      <ProfileTabs
        posts={
          posts.error ? (
            <p className="text-sm text-muted-foreground">Couldn&apos;t load the posts.</p>
          ) : (
            <Feed
              initialPage={posts.data}
              author={handle}
              empty={
                <Empty className="py-16">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <HugeiconsIcon icon={NoteIcon} />
                    </EmptyMedia>
                    <EmptyTitle>Nothing left to read</EmptyTitle>
                    <EmptyDescription>
                      Every post lives 24 hours. This one&apos;s are gone, or were never written.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              }
            />
          )
        }
        comments={
          comments.error ? (
            <p className="text-sm text-muted-foreground">Couldn&apos;t load the comments.</p>
          ) : (
            <ProfileComments
              username={handle}
              displayUsername={profile.displayUsername ?? handle}
              initialPage={comments.data}
            />
          )
        }
      />
    </div>
  );
};
