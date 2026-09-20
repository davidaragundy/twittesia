"use client";

import { ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

interface Props {
  safetyNumber: string | null;
  otherName: string;
}

/**
 * The number both sides show once they have agreed a key.
 *
 * Reading it out loud, on a call or in person, is how two people check that nobody handed them
 * different keys: the numbers only match when both sides hold the same two keys and the same
 * invite. Twittesia cannot make them match without the secret it has never seen.
 */
export const ChatSafetyNumber = ({ safetyNumber, otherName }: Props) => {
  if (!safetyNumber) return null;

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
        <HugeiconsIcon icon={ShieldKeyIcon} />
        Encrypted
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Safety number</p>
            <p className="text-sm text-muted-foreground">
              Read this out to {otherName}. If their number is the same, nobody is between you — not
              even Twittesia, which never sees the key half of the invite.
            </p>
          </div>
          <p className="rounded-lg bg-muted px-3 py-2 text-center font-mono text-sm tracking-wider">
            {safetyNumber}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
