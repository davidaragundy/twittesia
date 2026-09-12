"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

export const FeedError = () => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Alert02Icon} />
        </EmptyMedia>
        <EmptyTitle>Couldn&apos;t load the feed</EmptyTitle>
        <EmptyDescription>Something went wrong on our side.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => router.refresh()}>Try again</Button>
      </EmptyContent>
    </Empty>
  );
};
