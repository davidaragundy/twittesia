import Link from "next/link";

import { LifespanRing } from "@/shared/components/lifespan-ring";
import { SeededAvatar } from "@/shared/components/seeded-avatar";

import type { Chat } from "@/features/chat/types/chat";
import { toChatPath } from "@/features/chat/utils/to-chat-path";

interface Props {
  chat: Chat;
  // The reader, so the chat is named after the other person rather than after them
  viewerId: string;
}

// One chat, as a card: who it is with, and its clock running down like everything else here
export const ChatListItem = ({ chat, viewerId }: Props) => {
  const other = chat.creator.id === viewerId ? chat.guest : chat.creator;

  return (
    <Link
      href={toChatPath({ id: chat.id })}
      className="flex items-center gap-4 rounded-3xl bg-muted/30 p-4 transition-colors outline-none hover:bg-muted/45 focus-visible:ring-3 focus-visible:ring-ring/30 sm:p-5"
    >
      <SeededAvatar seed={other?.handle ?? chat.id} className="size-12" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate font-semibold">{other ? other.name : "Waiting for someone"}</p>
        <p className="truncate text-sm text-muted-foreground">
          {other ? "Private chat" : "Nobody has been let in yet"}
        </p>
      </div>
      <LifespanRing startsAt={chat.createdAt} endsAt={chat.expiresAt} size={20} />
    </Link>
  );
};
