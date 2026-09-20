import { redirect } from "next/navigation";

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
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Chats</h1>
          <p className="text-sm text-muted-foreground">
            A chat is between two people, lasts a day at most, and is never written down.
          </p>
        </div>

        <StartChatButton />
      </div>

      <ChatList chats={chats} viewerId={session.user.id} />
    </div>
  );
}
