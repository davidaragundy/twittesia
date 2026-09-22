"use client";

import { useWelcomeToast } from "@/features/auth/hooks/use-welcome-toast";

// Tells a new identity who it is and how long it has. Renders nothing itself.
export function WelcomeToast() {
  useWelcomeToast();

  return null;
}
