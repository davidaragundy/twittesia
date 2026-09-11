import Link from "next/link";

import { Logo } from "@/shared/components/logo";
import { ThemeSwitch } from "@/shared/components/theme-switch";

type Props = {
  // Rendered before the logo, such as the sidebar trigger
  leading?: React.ReactNode;
  logoHref?: string;
  children?: React.ReactNode;
};

// The theme toggle always closes the header, after any page-specific actions
export function SiteHeader({ leading, logoHref = "/", children }: Props) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {leading}
        <Link href={logoHref} className="flex items-center gap-2 font-medium">
          <Logo />
          Twittesia
        </Link>
      </div>

      <nav aria-label="Site" className="flex items-center gap-2">
        {children}
        <ThemeSwitch />
      </nav>
    </header>
  );
}
