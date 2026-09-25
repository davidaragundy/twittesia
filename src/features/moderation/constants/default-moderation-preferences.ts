import type { ModerationPreferences } from "@/features/moderation/types/moderation-preferences";

// Everything on: every category hidden when flagged, and muted words muted once there are any
export const DEFAULT_MODERATION_PREFERENCES: ModerationPreferences = {
  isEnabled: true,
  shownCategories: [],
  isMutingWords: true,
  mutedWords: [],
};
