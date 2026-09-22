import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { THEME_OPTIONS } from "@/features/settings/constants/theme-options";

const subscribe = () => () => {};

export const useAppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  // The choice is kept in the browser, so the server can't know it: nothing is shown as chosen
  // until the page is in the browser, rather than showing the wrong one first
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return {
    value: isHydrated && theme ? [theme] : [],
    // Pressing the option that is already on leaves the group empty, and the choice unchanged
    onValueChange: ([next]: string[]) => {
      if (THEME_OPTIONS.some((option) => option.value === next)) setTheme(next);
    },
  };
};
