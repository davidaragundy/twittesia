"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Key01Icon, UserEdit01Icon } from "@hugeicons/core-free-icons";

import { SettingsNavLink } from "@/features/settings/components/settings-nav-link";
import { useSettingsInMobile } from "@/features/settings/hooks/use-settings-in-mobile";

const items = [
  {
    label: "Account",
    href: "/settings/account",
    icon: <HugeiconsIcon icon={UserEdit01Icon} />,
  },
  {
    label: "Security",
    href: "/settings/security",
    icon: <HugeiconsIcon icon={Key01Icon} />,
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: <HugeiconsIcon icon={Notification01Icon} />,
  },
];

export function SettingsSidebar() {
  const { isMobile, isMounted, isSettingsPage } = useSettingsInMobile();

  if (!isMounted) return null;

  if (isMobile && !isSettingsPage) return null;

  return (
    <aside className="w-full md:w-max h-full">
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <SettingsNavLink
            key={item.href}
            href={item.href}
            additionalMatches={
              !isMobile && item.href === "/settings/account" ? ["/settings"] : undefined
            }
            label={item.label}
            icon={item.icon}
            includeArrow
            exactMatch
          />
        ))}
      </nav>
    </aside>
  );
}
