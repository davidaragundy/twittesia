import { Chatting01Icon } from "@hugeicons/core-free-icons";
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
  title: "Twittesia | Chat",
};

export default function ChatPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Chatting01Icon} />
        </EmptyMedia>
        <EmptyTitle>Chats</EmptyTitle>
        <EmptyDescription>
          Your private conversations will show up here. Messages last 24 hours.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
