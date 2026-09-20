import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

// What someone searching far faster than anyone reads gets instead of results
export const SearchLimited = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <HugeiconsIcon icon={Clock01Icon} />
      </EmptyMedia>
      <EmptyTitle>Too many searches</EmptyTitle>
      <EmptyDescription>Give it a moment, then search again.</EmptyDescription>
    </EmptyHeader>
  </Empty>
);
