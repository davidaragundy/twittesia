import Link from "next/link";

import { Logo } from "@/shared/components/logo";
import { ThemeSwitch } from "@/shared/components/theme-switch";

type Props = {
  logoHref?: string;
  children?: React.ReactNode;
};

// The theme toggle always closes the header, after any page-specific actions
export function SiteHeader({ logoHref = "/", children }: Props) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4">
      <Link
        href={logoHref}
        className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"
      >
        <Logo size={28} />
        Twittesia
      </Link>

      <nav aria-label="Site" className="flex items-center gap-2">
        {children}
        <ThemeSwitch />
      </nav>
    </header>
  );
}
