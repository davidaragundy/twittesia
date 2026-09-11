import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import { SETTINGS_SEARCH_PARAM } from "@/features/settings/constants/settings-search-param";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import type { SettingsTab } from "@/features/settings/types/settings-tab";
import { isSettingsTab } from "@/features/settings/utils/is-settings-tab";
import { writeSettingsTab } from "@/features/settings/utils/write-settings-tab";

// The open tab lives in the URL, so links such as /home?settings=security open it directly
export const useSettingsDialog = () => {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const param = searchParams.get(SETTINGS_SEARCH_PARAM);
  const openTab = isSettingsTab(param) ? param : null;

  // Keeps the last tab on screen while the dialog animates closed
  const [lastTab, setLastTab] = useState<SettingsTab>(SETTINGS_SECTIONS[0].value);
  if (openTab && openTab !== lastTab) setLastTab(openTab);

  const onOpenChange = (open: boolean) => writeSettingsTab(open ? lastTab : null);

  const onTabChange = (value: unknown) => {
    if (isSettingsTab(value)) writeSettingsTab(value);
  };

  return { isMobile, isOpen: openTab !== null, tab: lastTab, onOpenChange, onTabChange };
};
