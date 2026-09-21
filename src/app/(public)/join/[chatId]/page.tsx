import type { Metadata } from "next";

import { JoinPage } from "@/features/chat/components/join-page";

export const metadata: Metadata = {
  title: "Twittesia | An invitation",
  // An invite is for one person, and the chat behind it is nobody else's business
  robots: { index: false, follow: false },
};

export default function JoinRoute({ params }: PageProps<"/join/[chatId]">) {
  return <JoinPage params={params} />;
}
