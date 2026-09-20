"use client";

import { ChatDoor } from "@/features/chat/components/chat-door";
import { ChatInvite } from "@/features/chat/components/chat-invite";
import { ChatRoom } from "@/features/chat/components/chat-room";
import { KnockList } from "@/features/chat/components/knock-list";
import { useChatDetail } from "@/features/chat/hooks/use-chat-detail";
import type { ChatView } from "@/features/chat/types/chat-view";

interface Props {
  initialView: ChatView;
  viewerId: string;
  // The reader's own handle, which is all anyone at the door is shown of them
  viewerHandle: string;
}

// One chat, as whoever is reading it may see it: its two people, its door, or its invite
export const ChatDetail = ({ initialView, viewerId, viewerHandle }: Props) => {
  const { chat, role, knocks, isWaiting, other } = useChatDetail({ initialView, viewerId });

  if (other) {
    return (
      <ChatRoom chatId={chat.id} viewerId={viewerId} other={other} expiresAt={chat.expiresAt} />
    );
  }

  if (role === "creator") {
    return (
      <div className="flex flex-col gap-8">
        <ChatInvite chatId={chat.id} />
        <KnockList chatId={chat.id} knocks={knocks} />
      </div>
    );
  }

  if (chat.guest) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Someone else is already in this chat. A chat only ever has two people in it.
      </p>
    );
  }

  return (
    <ChatDoor chatId={chat.id} creator={chat.creator} handle={viewerHandle} isWaiting={isWaiting} />
  );
};
