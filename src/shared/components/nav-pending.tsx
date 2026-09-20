"use client";

import { useLinkStatus } from "next/link";

import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

/**
 * The sign that a navigation is on its way, for the link that was clicked.
 *
 * It is always there and only fades in, so nothing moves when it appears. A page that was
 * prefetched arrives before it does, and it is never seen.
 */
export const NavPending = () => {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={cn(
        "ml-auto inline-flex transition-opacity duration-150",
        pending ? "opacity-100" : "opacity-0",
      )}
    >
      <Spinner />
    </span>
  );
};
