"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TabBarButton } from "@/shared/components/tab-bar-button";
import type { NavLink } from "@/shared/types/nav-link";
import { isNavLinkActive } from "@/shared/utils/is-nav-link-active";

type Props = {
  links: NavLink[];
  // Tabs after the links that need the session, such as the reader's account
  children?: React.ReactNode;
  // One thing to do from anywhere, floating beside the tabs, such as writing a post
  action?: React.ReactNode;
};

// Every page and the account, under the thumb on a phone: a pill floating over the page
export function TabBar({ links, children, action }: Props) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-5 z-40 flex items-center justify-center gap-2 md:hidden">
      <nav
        aria-label="Main"
        className="flex items-center gap-1 rounded-full bg-secondary/80 p-1.5 shadow-lg backdrop-blur-xl"
      >
        {links.map((link) => (
          <TabBarButton
            key={link.href}
            isActive={isNavLinkActive({ href: link.href, pathname })}
            label={link.label}
            icon={<HugeiconsIcon icon={link.icon} />}
            render={<Link href={link.href} />}
            nativeButton={false}
          />
        ))}
        {children}
      </nav>

      {action && (
        <div className="rounded-full bg-secondary/80 p-1.5 shadow-lg backdrop-blur-xl">
          {action}
        </div>
      )}
    </div>
  );
}
