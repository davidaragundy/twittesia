import { notFound } from "next/navigation";

import { getProfile } from "@/features/profile/actions/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { TypographyH1, TypographyMuted, TypographyP } from "@/shared/components/ui/typography";

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
    <main className="flex flex-col items-center gap-6">
      <Avatar className="size-42 sm:size-52">
        <AvatarImage src={data?.image ?? undefined} />
        <AvatarFallback className="text-6xl">
          {data?.name
            ?.split(" ")
            .map((name: string) => name.charAt(0))
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-1">
        <TypographyH1 className="text-center">{data?.name}</TypographyH1>
        <TypographyMuted className="text-center">@{data?.username}</TypographyMuted>
      </div>

      <div className="flex gap-3">
        <div className="flex w-1/2 flex-col items-center justify-center rounded-xl border px-3 py-2">
          <TypographyP className="text-xl font-bold">{data?.followerCount}</TypographyP>
          <TypographyMuted>Followers</TypographyMuted>
        </div>

        <div className="flex w-1/2 flex-col items-center justify-center rounded-xl border px-3 py-2">
          <TypographyP className="text-xl font-bold">{data?.followingCount}</TypographyP>
          <TypographyMuted>Following</TypographyMuted>
        </div>
      </div>
    </main>
  );
};
