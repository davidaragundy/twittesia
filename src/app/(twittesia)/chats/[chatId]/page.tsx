import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/shared/components/ui/spinner";

import { ChatPage } from "@/features/chat/components/chat-page";

export const metadata: Metadata = {
  title: "Twittesia | Chat",
};

export default function ChatRoute({ params }: PageProps<"/chats/[chatId]">) {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-12" />}>
      <ChatPage params={params} />
    </Suspense>
  );
}
