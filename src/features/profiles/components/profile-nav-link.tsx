"use client";

import { UserIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/shared/components/icon";
import { NavButton } from "@/shared/components/nav-button";

import { useSession } from "@/features/auth/hooks/use-session";

// Streams in once the session resolves; the layout shows the same button disabled meanwhile
export function ProfileNavLink() {
  const pathname = usePathname();
  const session = useSession();

  if (!session) return null;

  const href = `/${session.user.username}`;

  return (
    <NavButton isActive={pathname === href} render={<Link href={href} />}>
      <Icon icon={UserIcon} />
      Profile
    </NavButton>
  );
}
