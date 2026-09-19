"use client";

import { useStartErrorToast } from "@/features/auth/hooks/use-start-error-toast";

// Tells someone sent back by /start why they are not in. Renders nothing itself.
export function StartErrorToast() {
  useStartErrorToast();

  return null;
}
