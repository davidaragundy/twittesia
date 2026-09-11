import {
  AnonymousIcon,
  Chatting01Icon,
  Home01Icon,
  Search01Icon,
  UserCheck01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { headers } from "next/headers";
import { Suspense } from "react";

import { AppBreadcrumb } from "@/shared/components/app-breadcrumb";
import { AppNav } from "@/shared/components/app-nav";
import { MobileNav } from "@/shared/components/mobile-nav";
import { SiteHeader } from "@/shared/components/site-header";
import { auth } from "@/shared/lib/better-auth/server";

import { NavUser } from "@/features/auth/components/nav-user";
import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { SettingsMenuItem } from "@/features/settings/components/settings-menu-item";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  const session = await queryClient.fetchQuery({
    queryKey: [SESSION_QUERY_KEY],
    queryFn: async () => auth.api.getSession({ headers: await headers() }),
  });

  const links = [
    { href: "/home", label: "Home", icon: <HugeiconsIcon icon={Home01Icon} /> },
    {
      href: "/close-friends",
      label: "Close friends",
      icon: <HugeiconsIcon icon={UserCheck01Icon} />,
    },
    { href: "/ghosts", label: "Ghosts", icon: <HugeiconsIcon icon={AnonymousIcon} /> },
    { href: "/explore", label: "Explore", icon: <HugeiconsIcon icon={Search01Icon} /> },
    { href: "/chat", label: "Chat", icon: <HugeiconsIcon icon={Chatting01Icon} /> },
    {
      href: `/${session?.user.username}`,
      label: "Profile",
      icon: <HugeiconsIcon icon={UserIcon} />,
    },
  ];

  const navUser = <NavUser menuItems={<SettingsMenuItem />} />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto flex h-svh w-full max-w-6xl flex-col px-6 md:px-10">
        <SiteHeader leading={<MobileNav links={links} footer={navUser} />} logoHref="/home" />

        <div className="flex min-h-0 flex-1 gap-16">
          <aside className="hidden w-56 shrink-0 flex-col justify-between pt-2 pb-10 md:flex">
            <AppNav links={links} />
            {navUser}
          </aside>

          <main className="no-scrollbar flex min-w-0 flex-1 flex-col gap-10 overflow-y-auto pt-2 pb-16">
            <AppBreadcrumb links={links} />
            {children}
          </main>
        </div>
      </div>

      <Suspense>
        <SettingsDialog />
      </Suspense>
    </HydrationBoundary>
  );
}
