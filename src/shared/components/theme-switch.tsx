"use client";

import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          />
        }
      >
        <Icon icon={Sun01Icon} className="dark:hidden" />
        <Icon icon={Moon01Icon} className="hidden dark:block" />
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
