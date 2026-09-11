"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/shared/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

type Props = {
  links: { href: string; label: string; icon: React.ReactNode }[];
  footer: React.ReactNode;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ links, footer, ...props }: Props) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/home" />}>
              <Logo />
              <span className="truncate font-medium">Twittesia</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  render={<Link href={link.href} />}
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{footer}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
