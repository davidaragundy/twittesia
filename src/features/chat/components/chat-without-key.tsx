import { KeyframeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

// A tab that never had the key half of the invite, or no longer has it. There is nothing to fall
// back to: the key was never anywhere else, and nothing here will send in the clear.
export const ChatWithoutKey = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <HugeiconsIcon icon={KeyframeIcon} />
      </EmptyMedia>
      <EmptyTitle>This tab doesn&apos;t have the key</EmptyTitle>
      <EmptyDescription>
        A chat is encrypted with the half of its invite after the #, which stays in the tab that
        opened it and is never sent to us. Open the invite again in this tab, or start another chat.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);
