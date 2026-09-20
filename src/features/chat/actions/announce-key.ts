"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";

import { getSession } from "@/features/auth/queries/get-session";
import { getChat } from "@/features/chat/queries/get-chat";
import { announceKeySchema } from "@/features/chat/schemas/announce-key-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { publishChatEvent } from "@/features/chat/utils/publish-chat-event";

interface Props {
  chatId: string;
  publicKey: string;
  // Whether whoever is already here should send theirs back
  reply: boolean;
}

/**
 * Puts one side's public key on the chat's channel, so the other can work out the key they share.
 *
 * A public key is the half that is meant to be seen; the other half never leaves the page that
 * made it. Passing these on is all the server does towards a chat's encryption, and knowing both
 * of them gets it nothing without the secret in the invite, which it never sees.
 */
export const announceKey = async ({
  chatId,
  publicKey,
  reply,
}: Props): Promise<ActionResponse<null, "CHAT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = announceKeySchema.safeParse({ chatId, publicKey, reply });

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "That isn't a key" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const chat = await getChat({ id: input.data.chatId });

  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  await publishChatEvent({
    chatId: chat.id,
    event: {
      type: "key",
      identityId: session.user.id,
      publicKey: input.data.publicKey,
      reply: input.data.reply,
    },
  });

  return { data: null, error: null };
};
