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

import { AppSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar links={links} footer={<NavUser menuItems={<SettingsMenuItem />} />} />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>

        <Suspense>
          <SettingsDialog />
        </Suspense>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
