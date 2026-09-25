import { useState } from "react";

import { useModerationPreferences } from "@/features/moderation/hooks/use-moderation-preferences";
import type { ModerationCategory } from "@/features/moderation/types/moderation-category";

// Long enough for a phrase, short enough that a list of them stays readable
const MAX_MUTED_WORD_LENGTH = 40;

export const useModerationSettings = () => {
  const { preferences, setPreferences } = useModerationPreferences();
  const [draft, setDraft] = useState("");

  const word = draft.trim().replace(/\s+/g, " ").slice(0, MAX_MUTED_WORD_LENGTH);
  const isDuplicate = preferences.mutedWords.some(
    (muted) => muted.toLowerCase() === word.toLowerCase(),
  );

  return {
    preferences,
    draft,
    setDraft,
    canAddWord: !!word && !isDuplicate,
    setEnabled: (isEnabled: boolean) => setPreferences({ ...preferences, isEnabled }),
    // On means hidden when flagged, which is how every category starts
    setCategoryHidden: (category: ModerationCategory, isHidden: boolean) =>
      setPreferences({
        ...preferences,
        shownCategories: isHidden
          ? preferences.shownCategories.filter((shown) => shown !== category)
          : [...preferences.shownCategories, category],
      }),
    setMutingWords: (isMutingWords: boolean) => setPreferences({ ...preferences, isMutingWords }),
    addWord: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!word || isDuplicate) return;

      setPreferences({ ...preferences, mutedWords: [...preferences.mutedWords, word] });
      setDraft("");
    },
    removeWord: (removed: string) =>
      setPreferences({
        ...preferences,
        mutedWords: preferences.mutedWords.filter((muted) => muted !== removed),
      }),
  };
};
