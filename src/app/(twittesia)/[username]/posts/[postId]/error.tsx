"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Panel } from "@/shared/components/panel";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

interface Props {
  retry: () => void;
}

export default function Error({ retry }: Props) {
  return (
    <Panel className="py-4">
      <Empty>
        <title>Twittesia | Error</title>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon={Alert02Icon} />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>We couldn&apos;t load this post. Try again.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => retry()}>Try again</Button>
        </EmptyContent>
      </Empty>
    </Panel>
  );
}
