import { BubbleChatIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Panel } from "@/shared/components/panel";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

import { ChatListItem } from "@/features/chat/components/chat-list-item";
import type { Chat } from "@/features/chat/types/chat";

interface Props {
  chats: Chat[];
  viewerId: string;
}

export const ChatList = ({ chats, viewerId }: Props) => {
  if (!chats.length) {
    return (
      <Panel className="py-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon icon={BubbleChatIcon} />
            </EmptyMedia>
            <EmptyTitle>No chats yet</EmptyTitle>
            <EmptyDescription>
              Start one and send the link to the person you want to talk to. Nobody else can use it.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} viewerId={viewerId} />
      ))}
    </div>
  );
};
