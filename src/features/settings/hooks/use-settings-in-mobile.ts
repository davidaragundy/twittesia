import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useSettingsInMobile = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSettingsPage = pathname === "/settings";

  return {
    isMounted,
    isMobile,
    isSettingsPage,
  };
};
