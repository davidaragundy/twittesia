import { Search01Icon } from "@hugeicons/core-free-icons";
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
  title: "Twittesia | Explore",
};

export default function ExplorePage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Search01Icon} />
        </EmptyMedia>
        <EmptyTitle>Explore</EmptyTitle>
        <EmptyDescription>Posts from across Twittesia will show up here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
