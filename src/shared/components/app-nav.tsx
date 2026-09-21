"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/shared/components/icon";
import { NavButton } from "@/shared/components/nav-button";
import { NavPending } from "@/shared/components/nav-pending";
import type { NavLink } from "@/shared/types/nav-link";
import { isNavLinkActive } from "@/shared/utils/is-nav-link-active";

type Props = {
  links: NavLink[];
  // Entries after the links that aren't pages, such as Settings or Sign out
  children?: React.ReactNode;
};

export function AppNav({ links, children }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex flex-col gap-2">
      {links.map((link) => (
        <NavButton
          key={link.href}
          isActive={isNavLinkActive({ href: link.href, pathname })}
          render={<Link href={link.href} />}
          nativeButton={false}
        >
          <Icon icon={link.icon} />
          {link.label}
          <NavPending />
        </NavButton>
      ))}
      {children}
    </nav>
  );
}
