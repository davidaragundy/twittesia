import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/features/profile/actions/get-profile";

interface Props {
  id?: string;
  username?: string;
}

export const useProfile = ({ id, username }: Props) => {
  if (!id && !username) {
    throw new Error("Either id or username is required in useProfile");
  }

  return useQuery({
    queryKey: ["profile", "detail", id, username],
    queryFn: async () => {
      const { data, error } = await getProfile({ id, username });

      if (error) throw new Error(error.message);

      return data;
    },
  });
};
