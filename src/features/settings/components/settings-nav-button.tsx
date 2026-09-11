"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";

import { writeSettingsTab } from "@/features/settings/utils/write-settings-tab";

export function SettingsNavButton() {
  return (
    <NavButton onClick={() => writeSettingsTab("account")}>
      <HugeiconsIcon icon={Settings01Icon} />
      Settings
    </NavButton>
  );
}
