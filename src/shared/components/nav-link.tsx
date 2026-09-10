"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/shared/utils/cn";

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
  includeArrow?: boolean;
  exactMatch?: boolean;
  additionalMatches?: string[];
} & React.ComponentProps<typeof Link>;

export const NavLink = ({
  href,
  label,
  icon,
  includeArrow,
  exactMatch,
  additionalMatches,
  ...props
}: Props) => {
  const pathname = usePathname();
  const matchesAdditionalPath = additionalMatches?.includes(pathname);
  const isActive =
    exactMatch || matchesAdditionalPath
      ? pathname === href || matchesAdditionalPath
      : pathname.startsWith(href);

  return (
    <Link
      title={label}
      aria-label={label}
      href={href}
      className={cn(
        "w-fit flex flex-wrap items-center text-xl gap-2 aspect-square md:aspect-auto rounded-full md:rounded-xl p-2 md:px-4 md:py-2 transition-all duration-200",
        isActive ? "bg-accent" : "hover:bg-accent",
        includeArrow && "w-full justify-between",
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="hidden md:flex">{label}</span>
      </div>
      {includeArrow ? <HugeiconsIcon icon={ArrowRight01Icon} /> : null}
    </Link>
  );
};
