import { BubbleChatIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { ItemGroup } from "@/shared/components/ui/item";

import { ChatListItem } from "@/features/chat/components/chat-list-item";
import type { Chat } from "@/features/chat/types/chat";

interface Props {
  chats: Chat[];
  viewerId: string;
}

export const ChatList = ({ chats, viewerId }: Props) => {
  if (!chats.length) {
    return (
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
    );
  }

  return (
    <ItemGroup>
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} viewerId={viewerId} />
      ))}
    </ItemGroup>
  );
};
