import { CHARACTER_COUNT_RING_GEOMETRY } from "@/shared/constants/character-count-ring-geometry";
import { CHARACTER_COUNT_WARNING_THRESHOLD } from "@/shared/constants/character-count-warning-threshold";
import type { CharacterCountTone } from "@/shared/types/character-count-tone";

type Props = {
  length: number;
  max: number;
};

export const useCharacterCountRing = ({ length, max }: Props) => {
  const remaining = max - length;
  const circumference = 2 * Math.PI * CHARACTER_COUNT_RING_GEOMETRY.radius;
  const progress = Math.min(length / max, 1);

  const tone: CharacterCountTone =
    remaining < 0 ? "over" : remaining <= CHARACTER_COUNT_WARNING_THRESHOLD ? "warning" : "normal";

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
