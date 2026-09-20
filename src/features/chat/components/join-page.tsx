import { notFound } from "next/navigation";

import { getSession } from "@/features/auth/queries/get-session";
import { JoinInvite } from "@/features/chat/components/join-invite";
import { getChat } from "@/features/chat/queries/get-chat";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

interface Props {
  params: Promise<{ chatId: string }>;
}

/**
 * Where an invite lands, for anyone at all.
 *
 * It is the one page of a chat someone outside it can see, and it says only that one exists and
 * who started it. Everything else waits until they have an identity and have been let in.
 *
 * Reads the request, so render it inside a <Suspense> boundary.
 */
export async function JoinPage({ params }: Props) {
  const { chatId } = await params;
  const id = chatIdSchema.safeParse(chatId);

  if (!id.success) notFound();

  const chat = await getChat({ id: id.data });

  if (!chat) notFound();

  const session = await getSession();

  return (
    <JoinInvite
      chatId={chat.id}
      creatorName={chat.creator.name}
      creatorHandle={chat.creator.handle}
      isFull={!!chat.guest && chat.guest.id !== session?.user.id}
      hasIdentity={!!session}
    />
  );
}
