import { UserCheck01Icon } from "@hugeicons/core-free-icons";
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
  title: "Twittesia | Close Friends",
};

export default function CloseFriendsPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserCheck01Icon} />
        </EmptyMedia>
        <EmptyTitle>Close friends</EmptyTitle>
        <EmptyDescription>
          Posts shared only with your close friends will show up here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
