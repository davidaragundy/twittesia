"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useNavUser } from "@/features/auth/hooks/use-nav-user";

export function SignOutNavButton() {
  const { handleSignOut, isSigningOut } = useNavUser();

  return (
    <NavButton onClick={() => handleSignOut()} disabled={isSigningOut}>
      {isSigningOut ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
      Sign out
    </NavButton>
  );
}
