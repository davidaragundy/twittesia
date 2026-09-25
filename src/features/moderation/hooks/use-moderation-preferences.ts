import { useSyncExternalStore } from "react";

import { moderationPreferencesStore } from "@/features/moderation/utils/moderation-preferences-store";

export const useModerationPreferences = () => {
  const preferences = useSyncExternalStore(
    moderationPreferencesStore.subscribe,
    moderationPreferencesStore.getSnapshot,
    moderationPreferencesStore.getServerSnapshot,
  );

  return { preferences, setPreferences: moderationPreferencesStore.set };
};
