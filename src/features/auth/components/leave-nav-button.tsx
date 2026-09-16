"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";

import { writeLeaveOpen } from "@/features/auth/utils/write-leave-open";

// Not "sign out": there is nothing to sign back in to. Opens the confirmation rather than
// leaving, because leaving takes the identity and every post with it.
export function LeaveNavButton() {
  return (
    <NavButton
      onClick={() => writeLeaveOpen(true)}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
    >
      <HugeiconsIcon icon={Logout01Icon} />
      Leave
    </NavButton>
  );
}
