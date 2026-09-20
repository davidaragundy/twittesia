import Link from "next/link";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";

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
      {/* The clock differs between the server and the browser by a moment */}
      <Badge variant="outline" suppressHydrationWarning>
        Ends {formatRelativeTime(chat.expiresAt)}
      </Badge>
    </Item>
  );
};
