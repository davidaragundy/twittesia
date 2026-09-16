import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";
import { POST_LENGTH_RING_GEOMETRY } from "@/features/posts/constants/post-length-ring-geometry";
import { POST_LENGTH_WARNING_THRESHOLD } from "@/features/posts/constants/post-length-warning-threshold";
import type { PostLengthTone } from "@/features/posts/types/post-length-tone";

interface Props {
  length: number;
}

export const usePostLengthRing = ({ length }: Props) => {
  const remaining = MAX_POST_LENGTH - length;
  const circumference = 2 * Math.PI * POST_LENGTH_RING_GEOMETRY.radius;
  const progress = Math.min(length / MAX_POST_LENGTH, 1);

  const tone: PostLengthTone =
    remaining < 0 ? "over" : remaining <= POST_LENGTH_WARNING_THRESHOLD ? "warning" : "normal";

  return {
    remaining,
    tone,
    circumference,
    dashOffset: circumference * (1 - progress),
    showCount: tone !== "normal",
    label:
      remaining < 0 ? `${-remaining} characters over the limit` : `${remaining} characters left`,
  };
};
