"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavButton } from "@/shared/components/nav-button";
import type { NavLink } from "@/shared/types";

type Props = {
  links: NavLink[];
  onNavigate?: () => void;
  // Entries after the links that aren't pages, such as Settings or Sign out
  children?: React.ReactNode;
};

export function AppNav({ links, onNavigate, children }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex flex-col gap-2">
      {links.map((link) => (
        <NavButton
          key={link.href}
          isActive={pathname === link.href}
          render={<Link href={link.href} onClick={onNavigate} />}
          nativeButton={false}
        >
          {link.icon}
          {link.label}
        </NavButton>
      ))}
      {children}
    </nav>
  );
}
