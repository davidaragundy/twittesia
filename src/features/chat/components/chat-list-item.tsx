import Link from "next/link";

import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

import type { Chat } from "@/features/chat/types/chat";
import { toChatPath } from "@/features/chat/utils/to-chat-path";

interface Props {
  chat: Chat;
  // The reader, so the chat is named after the other person rather than after them
  viewerId: string;
}

export const ChatListItem = ({ chat, viewerId }: Props) => {
  const other = chat.creator.id === viewerId ? chat.guest : chat.creator;

  return (
    <Item render={<Link href={toChatPath({ id: chat.id })} />} variant="outline">
      <ItemMedia>
        <SeededAvatar seed={other?.handle ?? chat.id} className="size-10" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{other ? other.name : "Waiting for someone"}</ItemTitle>
        <ItemDescription>
          <span className="handle">
            {other ? `@${other.handle}` : "Nobody has been let in yet"}
          </span>
        </ItemDescription>
      </ItemContent>
      <Badge variant="outline">
        Ends <RelativeTime date={chat.expiresAt} />
      </Badge>
    </Item>
  );
};
