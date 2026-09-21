import { PencilEdit02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";

import { AppNav } from "@/shared/components/app-nav";
import { NavButton } from "@/shared/components/nav-button";
import { SiteHeader } from "@/shared/components/site-header";
import { TabBar } from "@/shared/components/tab-bar";
import { TabBarButton } from "@/shared/components/tab-bar-button";
import { Button } from "@/shared/components/ui/button";
import { APP_NAV_LINKS } from "@/shared/constants/app-nav-links";

import { AccountDrawer } from "@/features/auth/components/account-drawer";
import { LeaveNavButton } from "@/features/auth/components/leave-nav-button";
import { NavUser } from "@/features/auth/components/nav-user";
import { NavUserSkeleton } from "@/features/auth/components/nav-user-skeleton";
import { SessionGuard } from "@/features/auth/components/session-guard";
import { SessionProvider } from "@/features/auth/components/session-provider";
import { PostComposeDialog } from "@/features/posts/components/post-compose-dialog";
import { ProfileNavLink } from "@/features/profiles/components/profile-nav-link";
import { LeaveDialog } from "@/features/settings/components/leave-dialog";
import { SettingsMenuItem } from "@/features/settings/components/settings-menu-item";
import { SettingsNavButton } from "@/features/settings/components/settings-nav-button";

// Not async: nothing here waits for the request, so the shell streams at once and a page's
// loading state shows the instant it is clicked. Each part that needs the session reads it
// inside its own <Suspense> boundary; the reads share one lookup per request.
export default function Layout({ children, modal }: LayoutProps<"/">) {
  return (
    <>
      <div className="mx-auto flex min-h-svh w-full max-w-4xl flex-col px-6 sm:px-10">
        {/* The page scrolls as a whole, so the wheel works over the margins too, and the header
            and sidebar stay in place */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
          <SiteHeader logoHref="/home" />
        </div>

        <div className="flex flex-1 gap-12">
          <aside className="sticky top-20 hidden h-[calc(100svh-5rem)] w-60 shrink-0 flex-col justify-between pt-4 pb-12 md:flex">
            <div className="flex flex-col gap-6">
              <AppNav links={APP_NAV_LINKS}>
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
              </AppNav>
              <SessionProvider>
                <PostComposeDialog
                  trigger={
                    <Button size="lg" className="w-full">
                      <HugeiconsIcon icon={PencilEdit02Icon} data-icon="inline-start" />
                      New post
                    </Button>
                  }
                />
              </SessionProvider>
            </div>
            <Suspense fallback={<NavUserSkeleton />}>
              <SessionProvider>
                <NavUser menuItems={<SettingsMenuItem />} />
              </SessionProvider>
            </Suspense>
          </aside>

          {/* On a phone, room at the bottom for the floating tab bar */}
          <main className="flex max-w-xl min-w-0 flex-1 flex-col gap-12 pt-4 pb-36 md:pb-24">
            {children}
          </main>
        </div>
      </div>

      <TabBar
        links={APP_NAV_LINKS}
        action={
          <SessionProvider>
            <PostComposeDialog
              trigger={
                <Button size="icon-lg" aria-label="New post">
                  <HugeiconsIcon icon={PencilEdit02Icon} />
                </Button>
              }
            />
          </SessionProvider>
        }
      >
        <Suspense
          fallback={
            <TabBarButton disabled label="Profile" icon={<HugeiconsIcon icon={UserIcon} />} />
          }
        >
          <SessionProvider>
            <AccountDrawer
              actions={
                <>
                  <ProfileNavLink />
                  <SettingsNavButton />
                  <LeaveNavButton />
                </>
              }
            />
          </SessionProvider>
        </Suspense>
      </TabBar>

      <Suspense>
        <SessionGuard />
      </Suspense>

      {modal}

      <Suspense>
        <LeaveDialog />
      </Suspense>
    </>
  );
}
