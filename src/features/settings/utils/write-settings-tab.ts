import { SETTINGS_SEARCH_PARAM } from "@/features/settings/constants";
import type { SettingsTab } from "@/features/settings/types";

// Shallow URL update through the native History API: Next.js syncs it with useSearchParams
// without a server round trip, so the settings dialog reacts instantly
export const writeSettingsTab = (tab: SettingsTab | null) => {
  const url = new URL(window.location.href);

  if (tab) url.searchParams.set(SETTINGS_SEARCH_PARAM, tab);
  else url.searchParams.delete(SETTINGS_SEARCH_PARAM);

  window.history.replaceState(null, "", url);
};
