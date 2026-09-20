"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { ACCEPT_KNOCK_SCRIPT } from "@/features/chat/constants/accept-knock-script";
import { getChat } from "@/features/chat/queries/get-chat";
import { knockDecisionSchema } from "@/features/chat/schemas/knock-decision-schema";
import type { ChatParticipant } from "@/features/chat/types/chat-participant";
import { toChatKey } from "@/features/chat/utils/to-chat-key";
import { toChatsKey } from "@/features/chat/utils/to-chats-key";
import { toKnock } from "@/features/chat/utils/to-knock";
import { toKnocksKey } from "@/features/chat/utils/to-knocks-key";

interface Props {
  chatId: string;
  identityId: string;
}

/**
 * Lets one of the people waiting into a chat, and spends the invite: everyone else waiting is
 * dropped, and the link admits nobody after this.
 *
 * The guest's identity is kept at least as long as the chat, as the creator's already is, so
 * neither side disappears in the middle of a conversation.
 */
export const acceptKnock = async ({
  chatId,
  identityId,
}: Props): Promise<
  ActionResponse<
    ChatParticipant,
    "CHAT_NOT_FOUND" | "CHAT_FULL" | "KNOCK_NOT_FOUND" | BaseActionErrorCode
  >
> => {
  const input = knockDecisionSchema.safeParse({ chatId, identityId });

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "That isn't a chat" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const chat = await getChat({ id: input.data.chatId });

  if (!chat || chat.creator.id !== session.user.id) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const expiresAtSeconds = Math.ceil(chat.expiresAt.getTime() / 1_000);

  const { data, error } = await tryCatch(
    redis.eval<string[], string | number>(
      ACCEPT_KNOCK_SCRIPT,
      [
        toChatKey({ id: chat.id }),
        toKnocksKey({ chatId: chat.id }),
        toChatsKey({ identityId: input.data.identityId }),
      ],
      [
        session.user.id,
        input.data.identityId,
        chat.id,
        String(Date.now()),
        String(expiresAtSeconds),
      ],
    ),
  );

  if (error) return { data: null, error: { code: "UNKNOWN", message: "Couldn't let them in" } };

  // Anything that reads as a number is the script saying no; what it says yes with is the JSON
  // the guest knocked with
  const refusal = Number(data);

  if (refusal === -2) {
    return { data: null, error: { code: "CHAT_FULL", message: "Someone is already in that chat" } };
  }

  if (refusal === -4) {
    return { data: null, error: { code: "KNOCK_NOT_FOUND", message: "They're no longer waiting" } };
  }

  if (!Number.isNaN(refusal)) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const guest = toKnock({ identityId: input.data.identityId, value: String(data) });

  if (!guest) {
    return {
      data: null,
      error: { code: "KNOCK_NOT_FOUND", message: "They're no longer waiting" },
    };
  }

  await tryCatch(
    redis
      .multi()
      .expireat(toIdentityKey({ id: guest.identityId }), expiresAtSeconds, "GT")
      .expireat(toHandleKey({ handle: guest.handle }), expiresAtSeconds, "GT")
      .exec(),
  );

  return {
    data: { id: guest.identityId, handle: guest.handle, name: guest.name },
    error: null,
  };
};
