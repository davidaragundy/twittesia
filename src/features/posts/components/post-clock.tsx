"use client";

import { LifespanRing } from "@/shared/components/lifespan-ring";

import { usePostClock } from "@/features/posts/hooks/use-post-clock";

interface Props {
  createdAt: Date;
}

// A post's day at a glance: the clock empties as it runs out, and says when it was written and
// how long it has left on hover. It stands in for the time, which would only say it again.
export const PostClock = ({ createdAt }: Props) => {
  const { expiresAt, details } = usePostClock({ createdAt });

  return <LifespanRing startsAt={createdAt} endsAt={expiresAt} size={16} details={details} />;
};
