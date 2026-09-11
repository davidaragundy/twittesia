import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import { SETTINGS_SEARCH_PARAM, SETTINGS_TABS } from "@/features/settings/constants";
import type { SettingsTab } from "@/features/settings/types";
import { writeSettingsTab } from "@/features/settings/utils/write-settings-tab";

const isSettingsTab = (value: unknown): value is SettingsTab =>
  SETTINGS_TABS.some((tab) => tab === value);

// The open tab lives in the URL, so links such as /home?settings=security open it directly
export const useSettingsDialog = () => {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const param = searchParams.get(SETTINGS_SEARCH_PARAM);
  const openTab = isSettingsTab(param) ? param : null;

  // Keeps the last tab on screen while the dialog animates closed
  const [lastTab, setLastTab] = useState<SettingsTab>("account");
  if (openTab && openTab !== lastTab) setLastTab(openTab);

  const onOpenChange = (open: boolean) => writeSettingsTab(open ? lastTab : null);

  const onTabChange = (value: unknown) => {
    if (isSettingsTab(value)) writeSettingsTab(value);
  };

  return { isMobile, isOpen: openTab !== null, tab: lastTab, onOpenChange, onTabChange };
};
