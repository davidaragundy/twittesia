import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";

import { AppNav } from "@/shared/components/app-nav";
import { MobileNav } from "@/shared/components/mobile-nav";
import { NavButton } from "@/shared/components/nav-button";
import { SiteHeader } from "@/shared/components/site-header";
import { APP_NAV_LINKS } from "@/shared/constants/app-nav-links";

import { NavUser } from "@/features/auth/components/nav-user";
import { NavUserSkeleton } from "@/features/auth/components/nav-user-skeleton";
import { SessionProvider } from "@/features/auth/components/session-provider";
import { SignOutNavButton } from "@/features/auth/components/sign-out-nav-button";
import { getSession } from "@/features/auth/queries/get-session";
import { ProfileNavLink } from "@/features/profiles/components/profile-nav-link";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { SettingsMenuItem } from "@/features/settings/components/settings-menu-item";
import { SettingsNavButton } from "@/features/settings/components/settings-nav-button";
import { getSessions } from "@/features/settings/queries/get-sessions";

// Not async: nothing here waits for the request, so the whole shell prerenders.
// The session and active sessions start loading now and stream into the parts that need them.
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = getSession();
  const sessions = getSessions();

  const profileLink = (
    <Suspense
      fallback={
        <NavButton disabled>
          <HugeiconsIcon icon={UserIcon} />
          Profile
        </NavButton>
      }
    >
      <ProfileNavLink />
    </Suspense>
  );

  return (
    <SessionProvider session={session}>
      <div className="mx-auto flex h-svh w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">
        <SiteHeader
          leading={
            <MobileNav
              links={APP_NAV_LINKS}
              actions={
                <>
                  {profileLink}
                  <SettingsNavButton />
                  <SignOutNavButton />
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
              <NavUser menuItems={<SettingsMenuItem />} />
            </Suspense>
          </aside>

          <main className="no-scrollbar flex min-w-0 flex-1 flex-col gap-12 overflow-y-auto pt-4 pb-24">
            {children}
          </main>
        </div>
      </div>

      <Suspense>
        <SettingsDialog sessions={sessions} />
      </Suspense>
    </SessionProvider>
  );
}
