"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TabBarButton } from "@/shared/components/tab-bar-button";
import type { NavLink } from "@/shared/types/nav-link";

type Props = {
  links: NavLink[];
  // Tabs after the links that need the session, such as the reader's own profile
  children?: React.ReactNode;
};

// The main pages under the thumb on a phone, where the sidebar doesn't fit
export function TabBar({ links, children }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {links.map((link) => (
          <TabBarButton
            key={link.href}
            isActive={pathname === link.href}
            label={link.label}
            icon={<HugeiconsIcon icon={link.icon} />}
            render={<Link href={link.href} />}
            nativeButton={false}
          />
        ))}
        {children}
      </div>
    </nav>
  );
}
