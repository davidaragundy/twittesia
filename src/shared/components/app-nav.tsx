"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavButton } from "@/shared/components/nav-button";
import { NavPending } from "@/shared/components/nav-pending";
import type { NavLink } from "@/shared/types/nav-link";

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
          isActive={pathname === link.href}
          render={<Link href={link.href} />}
          nativeButton={false}
        >
          <HugeiconsIcon icon={link.icon} />
          {link.label}
          <NavPending />
        </NavButton>
      ))}
      {children}
    </nav>
  );
}
