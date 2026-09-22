import { useRelativeTime } from "@/shared/hooks/use-relative-time";

import { getPostExpiry } from "@/features/posts/utils/get-post-expiry";

interface Props {
  createdAt: Date;
}

export const usePostClock = ({ createdAt }: Props) => {
  const { relative, absolute } = useRelativeTime({ date: createdAt });

  return {
    expiresAt: getPostExpiry({ createdAt }),
    // "now" alone reads as a command, so it gets a word
    details: `Posted ${relative === "now" ? "just now" : relative} · ${absolute}`,
  };
};
