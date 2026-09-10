"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/utils/cn";

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
  includeArrow?: boolean;
  exactMatch?: boolean;
  additionalMatches?: string[];
} & React.ComponentProps<typeof Link>;

export const SettingsNavLink = ({
  href,
  label,
  icon,
  includeArrow,
  exactMatch,
  additionalMatches,
  ...props
}: Props) => {
  const pathname = usePathname();

  const matches = [href, ...(additionalMatches || [])];
  const isActive = matches.some((match) =>
    exactMatch ? pathname === match : pathname.startsWith(match),
  );

  return (
    <Link
      title={label}
      aria-label={label}
      href={href}
      className={cn(
        "flex w-fit flex-wrap items-center gap-2 rounded-xl px-4 py-2 text-xl transition-all duration-200",
        isActive ? "bg-accent" : "hover:bg-accent",
        includeArrow && "w-full justify-between",
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {includeArrow && <HugeiconsIcon icon={ArrowRight01Icon} />}
    </Link>
  );
};
