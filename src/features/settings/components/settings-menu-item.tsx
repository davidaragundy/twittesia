"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";

import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

export function SettingsMenuItem() {
  return (
    <DropdownMenuItem
      render={<Link href={toSettingsPath({ section: SETTINGS_SECTIONS[0].value })} />}
    >
      <HugeiconsIcon icon={Settings01Icon} />
      Settings
    </DropdownMenuItem>
  );
}
