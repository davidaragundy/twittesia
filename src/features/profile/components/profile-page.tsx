import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

import { getProfile } from "@/features/profile/actions/get-profile";

interface Props {
  username: string;
}

export const ProfilePage = async ({ username }: Props) => {
  const { data, error } = await getProfile({ username });

  if (error) {
    if (error.message === "User not found") return notFound();

    throw new Error("Something went wrong while fetching the profile data");
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Avatar size="lg">
        <AvatarImage src={data?.image ?? undefined} alt={data?.name} />
        <AvatarFallback>
          {data?.name
            ?.split(" ")
            .map((name: string) => name.charAt(0))
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{data?.name}</h1>
        <p className="text-muted-foreground">@{data?.username}</p>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline">{data?.followerCount} followers</Badge>
        <Badge variant="outline">{data?.followingCount} following</Badge>
      </div>
    </div>
  );
};
