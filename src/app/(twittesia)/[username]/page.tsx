import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfilePage } from "@/features/profiles/components/profile-page";
import { ProfilePageSkeleton } from "@/features/profiles/components/profile-page-skeleton";

export async function generateMetadata({ params }: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Twittesia | Profile (@${username})`,
  };
}

// The username is only known per request, so the profile streams in behind a skeleton
export default function ProfileRoute({ params }: PageProps<"/[username]">) {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfileGate params={params} />
    </Suspense>
  );
}

async function ProfileGate({ params }: Pick<PageProps<"/[username]">, "params">) {
  const { username } = await params;

  return <ProfilePage username={username} />;
}
