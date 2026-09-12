"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useLeave } from "@/features/auth/hooks/use-leave";

// Not "sign out": there is nothing to sign back in to. Leaving ends the identity for good, and
// the next visit starts a new one with a different handle and none of the posts.
export function LeaveNavButton() {
  const { leave, isLeaving } = useLeave();

  return (
    <NavButton
      onClick={leave}
      disabled={isLeaving}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
    >
      {isLeaving ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
      Leave
    </NavButton>
  );
}
