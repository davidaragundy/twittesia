"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { NavButton } from "@/shared/components/nav-button";

import { writeLeaveOpen } from "@/features/auth/utils/write-leave-open";

// Not "sign out": there is nothing to sign back in to. Opens the confirmation rather than
// leaving, because leaving takes the identity and every post with it.
export function LeaveNavButton() {
  return (
    <NavButton onClick={() => writeLeaveOpen(true)}>
      <Icon icon={Logout01Icon} />
      Leave
    </NavButton>
  );
}
