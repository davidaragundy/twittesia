"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import type { NavLink } from "@/shared/types";

type Props = {
  links: NavLink[];
};

export function AppBreadcrumb({ links }: Props) {
  const pathname = usePathname();

  // Pages outside the navigation, such as another user's profile, fall back to their path
  const current = links.find((link) => link.href === pathname)?.label ?? `@${pathname.slice(1)}`;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/home" />}>Twittesia</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
