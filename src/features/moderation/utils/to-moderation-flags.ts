import { MODERATION_CATEGORIES } from "@/features/moderation/constants/moderation-categories";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";

interface Props {
  // The field as stored on a post or comment hash, absent on anything never screened
  value: string | null | undefined;
}

// The flags a post or comment was stored with, keeping only categories that still exist and
// probabilities that make sense, or null when it was never screened
export const toModerationFlags = ({ value }: Props): ModerationFlags | null => {
  if (!value) return null;

  try {
    const stored = JSON.parse(value) as Record<string, unknown>;

    return Object.fromEntries(
      MODERATION_CATEGORIES.flatMap(({ value: category }) => {
        const probability = stored[category];

        return typeof probability === "number" && probability >= 0 && probability <= 1
          ? [[category, probability]]
          : [];
      }),
    );
  } catch {
    return null;
  }
};
