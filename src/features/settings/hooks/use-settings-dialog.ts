import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import { SETTINGS_PATH } from "@/features/settings/constants/settings-path";
import { isSettingsTab } from "@/features/settings/utils/is-settings-tab";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

interface Props {
  // The route's params, read here, under the boundary, so opening the dialog never waits on them
  params: Promise<{ section: string }>;
}

/**
 * The dialog is a route, /settings/<section>, intercepted over the page it was opened from. It is
 * open for as long as that route is the one showing; closing it plays the closing animation and
 * then goes back to the page underneath. Switching sections replaces the URL, so going back still
 * closes it.
 *
 * Whether it is open follows the route rather than being remembered. Next keeps the slot's React
 * tree between navigations, so a dialog that remembered being closed would never open again
 * without a reload.
 */
export const useSettingsDialog = ({ params }: Props) => {
  const { section } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isSettingsRoute = pathname.startsWith(SETTINGS_PATH);
  const [isOpen, setIsOpen] = useState(isSettingsRoute);

  useEffect(() => {
    if (isSettingsRoute) setIsOpen(true);
  }, [isSettingsRoute]);

  const onOpenChange = (open: boolean) => setIsOpen(open);

  // Only once the closing animation has run, and only from the route it belongs to, so a dialog
  // left behind by a navigation never sends anyone back
  const onOpenChangeComplete = (open: boolean) => {
    if (!open && isSettingsRoute) router.back();
  };

  const onTabChange = (value: unknown) => {
    if (isSettingsTab(value)) router.replace(toSettingsPath({ section: value }), { scroll: false });
  };

  return {
    section: isSettingsTab(section) ? section : null,
    isMobile,
    isOpen,
    onOpenChange,
    onOpenChangeComplete,
    onTabChange,
  };
};
