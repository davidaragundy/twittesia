"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { NavButton } from "@/shared/components/nav-button";

import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

export function SettingsNavButton() {
  return (
    <NavButton
      render={<Link href={toSettingsPath({ section: SETTINGS_SECTIONS[0].value })} />}
      nativeButton={false}
    >
      <HugeiconsIcon icon={Settings01Icon} />
      Settings
    </NavButton>
  );
}
