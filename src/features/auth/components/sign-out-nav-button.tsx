"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useSignOut } from "@/features/auth/hooks/use-sign-out";

export function SignOutNavButton() {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <NavButton
      onClick={signOut}
      disabled={isSigningOut}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
    >
      {isSigningOut ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
      Sign out
    </NavButton>
  );
}
