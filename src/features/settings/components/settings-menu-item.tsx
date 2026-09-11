"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";

import { writeSettingsTab } from "@/features/settings/utils/write-settings-tab";

export function SettingsMenuItem() {
  return (
    <DropdownMenuItem onClick={() => writeSettingsTab("account")}>
      <HugeiconsIcon icon={Settings01Icon} />
      Settings
    </DropdownMenuItem>
  );
}
