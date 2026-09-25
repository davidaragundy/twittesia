import { DEFAULT_MODERATION_PREFERENCES } from "@/features/moderation/constants/default-moderation-preferences";
import { MODERATION_PREFERENCES_KEY } from "@/features/moderation/constants/moderation-preferences-key";
import type { ModerationPreferences } from "@/features/moderation/types/moderation-preferences";

const listeners = new Set<() => void>();
let raw: string | null = null;
let parsed: ModerationPreferences = DEFAULT_MODERATION_PREFERENCES;

// Storage can be missing or blocked, as in a private window; the defaults stand in then
const read = () => {
  try {
    return window.localStorage.getItem(MODERATION_PREFERENCES_KEY);
  } catch {
    return null;
  }
};

/**
 * A reader's moderation preferences, kept in their browser like the theme, for useSyncExternalStore.
 * The snapshot only changes when what is stored does, and another tab's change arrives here too.
 */
export const moderationPreferencesStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener("storage", listener);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  },
  getSnapshot: (): ModerationPreferences => {
    const next = read();

    if (next !== raw) {
      raw = next;
      try {
        parsed = next
          ? { ...DEFAULT_MODERATION_PREFERENCES, ...(JSON.parse(next) as ModerationPreferences) }
          : DEFAULT_MODERATION_PREFERENCES;
      } catch {
        parsed = DEFAULT_MODERATION_PREFERENCES;
      }
    }

    return parsed;
  },
  // The server can't know them, so it renders with everything on, which is also the safe side
  getServerSnapshot: () => DEFAULT_MODERATION_PREFERENCES,
  set: (next: ModerationPreferences) => {
    try {
      window.localStorage.setItem(MODERATION_PREFERENCES_KEY, JSON.stringify(next));
    } catch {
      // Not kept past this page, but still applied to it
    }

    raw = JSON.stringify(next);
    parsed = next;
    listeners.forEach((listener) => listener());
  },
};
