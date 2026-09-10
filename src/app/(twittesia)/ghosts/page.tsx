import { AnonymousIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

export const metadata: Metadata = {
  title: "Twittesia | Ghosts",
};

export default function GhostsPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={AnonymousIcon} />
        </EmptyMedia>
        <EmptyTitle>Ghosts</EmptyTitle>
        <EmptyDescription>
          Anonymous posts will show up here. No profile, just the words.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
