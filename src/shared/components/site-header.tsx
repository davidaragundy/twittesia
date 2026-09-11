import Link from "next/link";

import { Logo } from "@/shared/components/logo";
import { ThemeSwitch } from "@/shared/components/theme-switch";

type Props = {
  children?: React.ReactNode;
};

// The theme toggle always closes the header, after any page-specific actions
export function SiteHeader({ children }: Props) {
  return (
    <header className="flex h-16 items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 font-medium">
        <Logo />
        Twittesia
      </Link>

      <nav aria-label="Site" className="flex items-center gap-2">
        {children}
        <ThemeSwitch />
      </nav>
    </header>
  );
}
