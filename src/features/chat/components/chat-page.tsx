import { notFound, redirect } from "next/navigation";

import { getSession } from "@/features/auth/queries/get-session";
import { ChatDetail } from "@/features/chat/components/chat-detail";
import { getChatView } from "@/features/chat/queries/get-chat-view";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

interface Props {
  params: Promise<{ chatId: string }>;
}

// Reads the request, so render it inside a <Suspense> boundary.
export async function ChatPage({ params }: Props) {
  const { chatId } = await params;
  const id = chatIdSchema.safeParse(chatId);

  if (!id.success) notFound();

  const session = await getSession();

  if (!session) redirect("/session-expired");

  const view = await getChatView({ id: id.data, viewerId: session.user.id });

  // A chat that has ended reads the same as one that never was: there is nothing kept to say
  // which it is
  if (!view) notFound();

  return (
    <ChatDetail
      initialView={view}
      viewerId={session.user.id}
      viewerHandle={session.user.username}
    />
  );
}
