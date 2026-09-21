import type { Metadata } from "next";

import { ChatsPage } from "@/features/chat/components/chats-page";

export const metadata: Metadata = {
  title: "Twittesia | Chats",
};

export default function ChatsRoute() {
  return <ChatsPage />;
}
