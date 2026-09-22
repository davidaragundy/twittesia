import { Search01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

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

export default function NotFound() {
  return (
    <Panel className="py-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon={Search01Icon} />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>It may have reached its expiry, or it never existed.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/home" />} nativeButton={false}>
            Go home
          </Button>
        </EmptyContent>
      </Empty>
    </Panel>
  );
}
