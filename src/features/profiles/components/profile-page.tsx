import { notFound } from "next/navigation";

import { SeededAvatar } from "@/shared/components/seeded-avatar";

import { getProfile } from "@/features/profiles/queries/get-profile";

interface Props {
  username: string;
}

export const ProfilePage = async ({ username }: Props) => {
  const { data: profile, error } = await getProfile({ username });

  if (error?.code === "USER_NOT_FOUND") notFound();

  // Any other failure goes to the route's error boundary, which offers a retry
  if (error) throw new Error(error.message);

  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center">
      <SeededAvatar seed={profile.username ?? profile.id} size="lg" className="size-24" />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="text-muted-foreground">@{profile.username}</p>
      </div>
    </div>
  );
};
