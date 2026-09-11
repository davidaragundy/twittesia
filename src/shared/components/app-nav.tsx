"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { NavButton } from "@/shared/components/nav-button";
import type { NavLink } from "@/shared/types";

type Props = {
  links: NavLink[];
  onNavigate?: () => void;
  // Entries after the links that aren't pages, such as Settings or Sign out
  children?: React.ReactNode;
};

// Below a dynamic route the pathname is only known per request, so the links prerender
// without a highlight and the active one lights up once it resolves
export function AppNav({ links, onNavigate, children }: Props) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-2">
      <Suspense fallback={<NavLinks links={links} onNavigate={onNavigate} />}>
        <ActiveNavLinks links={links} onNavigate={onNavigate} />
      </Suspense>
      {children}
    </nav>
  );
}

function ActiveNavLinks(props: Omit<Props, "children">) {
  const pathname = usePathname();

  return <NavLinks {...props} activeHref={pathname} />;
}

function NavLinks({
  links,
  onNavigate,
  activeHref,
}: Omit<Props, "children"> & { activeHref?: string }) {
  return links.map((link) => (
    <NavButton
      key={link.href}
      isActive={activeHref === link.href}
      render={<Link href={link.href} onClick={onNavigate} />}
      nativeButton={false}
    >
      {link.icon}
      {link.label}
    </NavButton>
  ));
}
