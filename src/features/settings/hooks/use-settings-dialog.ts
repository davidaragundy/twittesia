import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import { SETTINGS_SEARCH_PARAM, SETTINGS_TABS } from "@/features/settings/constants";
import type { SettingsTab } from "@/features/settings/types";

const isSettingsTab = (value: string | null): value is SettingsTab =>
  SETTINGS_TABS.some((tab) => tab === value);

// The open tab lives in the URL, so links such as /home?settings=security open it directly
export const useSettingsDialog = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const param = searchParams.get(SETTINGS_SEARCH_PARAM);
  const tab = isSettingsTab(param) ? param : null;

  const setTab = useCallback(
    (nextTab: SettingsTab | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextTab) params.set(SETTINGS_SEARCH_PARAM, nextTab);
      else params.delete(SETTINGS_SEARCH_PARAM);

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onOpenChange = useCallback(
    (open: boolean) => setTab(open ? (tab ?? "account") : null),
    [setTab, tab],
  );

  const onTabChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string" && isSettingsTab(value)) setTab(value);
    },
    [setTab],
  );

  return { isMobile, isOpen: tab !== null, tab: tab ?? "account", onOpenChange, onTabChange };
};
