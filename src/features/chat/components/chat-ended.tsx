import { BubbleChatCancelIcon } from "@hugeicons/core-free-icons";
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

import { CHATS_PATH } from "@/features/chat/constants/chats-path";

// A chat that has ended, either because someone ended it or because it reached its expiry. There
// is nothing left of it: what was said was never written down, and the chat itself is gone.
export const ChatEnded = () => (
  <Panel className="py-4">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={BubbleChatCancelIcon} />
        </EmptyMedia>
        <EmptyTitle>This chat has ended</EmptyTitle>
        <EmptyDescription>
          There is nothing left of it, for either of you. Start another one to keep talking.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" render={<Link href={CHATS_PATH} />} nativeButton={false}>
          Back to chats
        </Button>
      </EmptyContent>
    </Empty>
  </Panel>
);
