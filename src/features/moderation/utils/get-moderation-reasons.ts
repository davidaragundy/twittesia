import { MODERATION_CATEGORIES } from "@/features/moderation/constants/moderation-categories";
import { MODERATION_THRESHOLD } from "@/features/moderation/constants/moderation-threshold";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";
import type { ModerationPreferences } from "@/features/moderation/types/moderation-preferences";

interface Props {
  flags: ModerationFlags | null;
  text: string;
  preferences: ModerationPreferences;
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Why a reader would rather not see a piece of writing, if they would: the categories Jev flagged
 * that they hide, then the muted words it contains. Nothing when moderation is off.
 *
 * A muted word matches as a whole word or phrase, in any case, so muting "ass" leaves "class"
 * alone.
 */
export const getModerationReasons = ({ flags, text, preferences }: Props) => {
  if (!preferences.isEnabled) return { categories: [], words: [] };

  const categories = MODERATION_CATEGORIES.filter(
    (category) =>
      (flags?.[category.value] ?? 0) >= MODERATION_THRESHOLD &&
      !preferences.shownCategories.includes(category.value),
  ).map((category) => category.label);

  const words = preferences.isMutingWords
    ? preferences.mutedWords.filter((word) =>
        new RegExp(`(?<![\\p{L}\\p{N}])${escape(word)}(?![\\p{L}\\p{N}])`, "iu").test(text),
      )
    : [];

  return { categories, words };
};
