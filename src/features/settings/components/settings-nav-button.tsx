"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/shared/components/icon";
import { NavButton } from "@/shared/components/nav-button";

import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

export function SettingsNavButton() {
  return (
    <NavButton render={<Link href={toSettingsPath({ section: SETTINGS_SECTIONS[0].value })} />}>
      <Icon icon={Settings01Icon} />
      Settings
    </NavButton>
  );
}
