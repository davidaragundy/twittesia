import type { Metadata } from "next";

import { ChatPage } from "@/features/chat/components/chat-page";

export const metadata: Metadata = {
  title: "Twittesia | Chat",
};

export default function ChatRoute({ params }: PageProps<"/chats/[chatId]">) {
  return <ChatPage params={params} />;
}
