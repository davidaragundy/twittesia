import type { Metadata } from "next";

import { ProfilePage } from "@/features/profiles/components/profile-page";

export async function generateMetadata({ params }: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Twittesia | Profile (@${username})`,
  };
}

export default async function ProfileRoute({ params }: PageProps<"/[username]">) {
  const { username } = await params;

  return <ProfilePage username={username} />;
}
