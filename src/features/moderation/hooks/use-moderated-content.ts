import { useState } from "react";

import { DEFAULT_MODERATION_PREFERENCES } from "@/features/moderation/constants/default-moderation-preferences";
import { useModerationPreferences } from "@/features/moderation/hooks/use-moderation-preferences";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";
import { getModerationReasons } from "@/features/moderation/utils/get-moderation-reasons";

interface Props {
  flags: ModerationFlags | null;
  text: string;
  isMine: boolean;
}

export const useModeratedContent = ({ flags, text, isMine }: Props) => {
  const { preferences } = useModerationPreferences();
  const [isRevealed, setRevealed] = useState(false);

  // Your own writing is never hidden from you. You are told what it was flagged for, whatever your
  // own preferences, since that is what others see it hidden behind by default.
  const { categories, words } = isMine
    ? getModerationReasons({ flags, text: "", preferences: DEFAULT_MODERATION_PREFERENCES })
    : getModerationReasons({ flags, text, preferences });
  const reasons = [...categories, ...words.map((word) => `“${word}”`)];

  return {
    reasons,
    // A category is Jev's judgment; a muted word is the reader's own, and is said to be
    isFlagged: !!categories.length,
    isHidden: !isMine && !!reasons.length && !isRevealed,
    // Revealed by the reader, so it can be hidden again
    isRevealed,
    reveal: () => setRevealed(true),
    hide: () => setRevealed(false),
  };
};
