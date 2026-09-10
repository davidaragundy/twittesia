"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowReloadHorizontalIcon, Loading03Icon } from "@hugeicons/core-free-icons";

import { useSidebar } from "@/shared/hooks/use-sidebar";
import { NavLink } from "@/shared/components/nav-link";
import { NavUser } from "@/shared/components/nav-user";
import { NavUserSkeleton } from "@/shared/components/nav-user-skeleton";
import { Button } from "@/shared/components/ui/button";
import { TypographyLarge } from "@/shared/components/ui/typography";

export const Sidebar = () => {
  const {
    isSessionError,
    isSessionLoading,
    isSessionRefetching,
    isSessionSuccess,
    links,
    refetchSession,
    session,
  } = useSidebar();

  return (
    <div className="flex flex-col items-center md:items-stretch gap-4">
      <TypographyLarge className="font-extrabold text-4xl">
        T<span className="hidden md:inline">wittesia</span>
      </TypographyLarge>

      <nav className="flex flex-col items-start md:items-stretch gap-2">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
        ))}
      </nav>

      <div className="mt-auto max-w-60">
        {isSessionLoading ? <NavUserSkeleton /> : null}

        {isSessionError ? (
          <Button variant="outline" className="w-full" onClick={() => refetchSession()}>
            Retry{" "}
            {isSessionRefetching ? (
              <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
            )}
          </Button>
        ) : null}

        {isSessionSuccess && session ? <NavUser user={session.user} /> : null}
      </div>
    </div>
  );
};
