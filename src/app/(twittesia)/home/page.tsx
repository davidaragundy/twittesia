import { Home01Icon } from "@hugeicons/core-free-icons";
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
  title: "Twittesia | Home",
};

export default function HomePage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Home01Icon} />
        </EmptyMedia>
        <EmptyTitle>Your feed</EmptyTitle>
        <EmptyDescription>
          Posts from the people you follow will show up here, for the 24 hours they live.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
