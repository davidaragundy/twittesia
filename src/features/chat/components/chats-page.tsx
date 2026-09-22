import { redirect } from "next/navigation";

import { PageHeader } from "@/shared/components/page-header";

import { getSession } from "@/features/auth/queries/get-session";
import { ChatList } from "@/features/chat/components/chat-list";
import { StartChatButton } from "@/features/chat/components/start-chat-button";
import { getChats } from "@/features/chat/queries/get-chats";

// Reads the request, so render it inside a <Suspense> boundary.
export async function ChatsPage() {
  const session = await getSession();

  if (!session) redirect("/session-expired");

  const chats = await getChats({ identityId: session.user.id });

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Chats"
        description="Between two people, for a day at most, and never written down."
        action={<StartChatButton />}
      />

      <ChatList chats={chats} viewerId={session.user.id} />
    </div>
  );
}
