import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";

import { AppNav } from "@/shared/components/app-nav";
import { MobileNav } from "@/shared/components/mobile-nav";
import { NavButton } from "@/shared/components/nav-button";
import { SiteHeader } from "@/shared/components/site-header";
import { APP_NAV_LINKS } from "@/shared/constants/app-nav-links";

import { LeaveDialog } from "@/features/auth/components/leave-dialog";
import { LeaveNavButton } from "@/features/auth/components/leave-nav-button";
import { NavUser } from "@/features/auth/components/nav-user";
import { NavUserSkeleton } from "@/features/auth/components/nav-user-skeleton";
import { SessionGuard } from "@/features/auth/components/session-guard";
import { SessionProvider } from "@/features/auth/components/session-provider";
import { ProfileNavLink } from "@/features/profiles/components/profile-nav-link";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { SettingsMenuItem } from "@/features/settings/components/settings-menu-item";
import { SettingsNavButton } from "@/features/settings/components/settings-nav-button";

// Not async: nothing here waits for the request, so the whole shell prerenders. Each part
// that needs the session reads it inside its own <Suspense> boundary; the reads share one
// lookup per request.
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileLink = (
    <Suspense
      fallback={
        <NavButton disabled>
          <HugeiconsIcon icon={UserIcon} />
          Profile
        </NavButton>
      }
    >
      <SessionProvider>
        <ProfileNavLink />
      </SessionProvider>
    </Suspense>
  );

  return (
    <>
      <div className="mx-auto flex h-svh w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">
        <SiteHeader
          leading={
            <MobileNav
              links={APP_NAV_LINKS}
              actions={
                <>
                  {profileLink}
                  <SettingsNavButton />
                  <LeaveNavButton />
                </>
              }
            />
          }
          logoHref="/home"
        />

        <div className="flex min-h-0 flex-1 gap-20">
          <aside className="hidden w-60 shrink-0 flex-col justify-between pt-4 pb-12 md:flex">
            <AppNav links={APP_NAV_LINKS}>{profileLink}</AppNav>
            <Suspense fallback={<NavUserSkeleton />}>
              <SessionProvider>
                <NavUser menuItems={<SettingsMenuItem />} />
              </SessionProvider>
            </Suspense>
          </aside>

          <main className="no-scrollbar flex min-w-0 flex-1 flex-col gap-12 overflow-y-auto pt-4 pb-24">
            {children}
          </main>
        </div>
      </div>

      <Suspense>
        <SessionGuard />
      </Suspense>

      <Suspense>
        <SessionProvider>
          <SettingsDialog />
        </SessionProvider>
      </Suspense>

      <Suspense>
        <LeaveDialog />
      </Suspense>
    </>
  );
}
