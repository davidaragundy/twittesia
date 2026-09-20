import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/shared/components/ui/spinner";

import { ChatsPage } from "@/features/chat/components/chats-page";

export const metadata: Metadata = {
  title: "Twittesia | Chats",
};

export default function ChatsRoute() {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-12" />}>
      <ChatsPage />
    </Suspense>
  );
}
