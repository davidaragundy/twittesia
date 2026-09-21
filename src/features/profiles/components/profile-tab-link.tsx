"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { TabBarButton } from "@/shared/components/tab-bar-button";

import { useSession } from "@/features/auth/hooks/use-session";

// The reader's own profile, as their face, once the session resolves; the layout shows a
// disabled tab meanwhile
export function ProfileTabLink() {
  const pathname = usePathname();
  const session = useSession();

  if (!session) return null;

  const href = `/${session.user.username}`;

  return (
    <TabBarButton
      isActive={pathname === href}
      label="Profile"
      icon={<SeededAvatar seed={session.user.username} size="sm" />}
      render={<Link href={href} />}
      nativeButton={false}
    />
  );
}
