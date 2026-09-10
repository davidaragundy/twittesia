import { ProfilePage } from "@/features/profile/components/profile-page";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `Twittesia | Profile (@${username})`,
  };
}

export default async function ProfileRoute({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return <ProfilePage username={username} />;
}
