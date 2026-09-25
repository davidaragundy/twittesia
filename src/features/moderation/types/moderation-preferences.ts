import type { ModerationCategory } from "@/features/moderation/types/moderation-category";

// What a reader has chosen to be spared, kept in their browser
export type ModerationPreferences = {
  // Hide anything at all
  isEnabled: boolean;
  // Categories they would rather see, everything else being hidden when flagged
  shownCategories: ModerationCategory[];
  // Hide what contains any of their muted words
  isMutingWords: boolean;
  mutedWords: string[];
};
