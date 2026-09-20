import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/shared/components/ui/spinner";

import { JoinPage } from "@/features/chat/components/join-page";

export const metadata: Metadata = {
  title: "Twittesia | An invitation",
  // An invite is for one person, and the chat behind it is nobody else's business
  robots: { index: false, follow: false },
};

export default function JoinRoute({ params }: PageProps<"/join/[chatId]">) {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-24" />}>
      <JoinPage params={params} />
    </Suspense>
  );
}
