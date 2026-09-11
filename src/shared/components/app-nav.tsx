"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavButton } from "@/shared/components/nav-button";
import type { NavLink } from "@/shared/types";

type Props = {
  links: NavLink[];
  onNavigate?: () => void;
};

export function AppNav({ links, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
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
    </nav>
  );
}
