import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { getChatView } from "@/features/chat/queries/get-chat-view";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

// What an open chat page asks for while it waits: who is knocking, and whether anyone has been
// let in. The conversation itself never comes this way.
export const handleChatRequest = async (
  _request: Request,
  { params }: RouteContext<"/api/chats/[chatId]">,
) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { chatId } = await params;
  const id = chatIdSchema.safeParse(chatId);

  if (!id.success) return NextResponse.json({ message: "That chat has gone" }, { status: 404 });

  const view = await getChatView({ id: id.data, viewerId: session.user.id });

  if (!view) return NextResponse.json({ message: "That chat has gone" }, { status: 404 });

  return NextResponse.json(view);
};
