import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import { isSettingsTab } from "@/features/settings/utils/is-settings-tab";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

/**
 * The dialog is a route, /settings/<section>, intercepted over the page it was opened from. It is
 * open for as long as that route is; closing it plays the closing animation, then goes back to
 * the page underneath. Switching sections replaces the URL, so going back still closes it.
 */
interface Props {
  // The route's params, read here, under the boundary, so opening the dialog never waits on them
  params: Promise<{ section: string }>;
}

export const useSettingsDialog = ({ params }: Props) => {
  const { section } = use(params);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = (open: boolean) => setIsOpen(open);

  const onOpenChangeComplete = (open: boolean) => {
    if (!open) router.back();
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
