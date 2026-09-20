import { z } from "zod";

import { MAX_CIPHER_LENGTH } from "@/features/chat/constants/max-cipher-length";

/**
 * Everything that travels on a chat's channel.
 *
 * A message is a nonce and a box: no part of this says what was said, here or anywhere else it is
 * read. It is parsed on the way in as well as on the way out, because a page should never render
 * something shaped differently to what it expects.
 */
export const chatEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("message"),
    id: z.uuid(),
    authorId: z.uuid(),
    cipher: z.string().min(1).max(MAX_CIPHER_LENGTH),
    iv: z.string().min(1).max(64),
    sentAt: z.number(),
  }),
  z.object({
    type: z.literal("here"),
    identityId: z.uuid(),
    // Whether whoever is already here should say so back
    reply: z.boolean(),
  }),
  z.object({ type: z.literal("away"), identityId: z.uuid() }),
  z.object({ type: z.literal("typing"), identityId: z.uuid() }),
  z.object({
    type: z.literal("received"),
    identityId: z.uuid(),
    // Which message reached the other page, and nothing about what it said
    messageId: z.uuid(),
  }),
  z.object({ type: z.literal("ended"), identityId: z.uuid() }),
  z.object({
    type: z.literal("key"),
    identityId: z.uuid(),
    // The public half of one side's pair, which is all that is ever sent of it
    publicKey: z.string().min(1).max(256),
    // Whether whoever is already here should send theirs back
    reply: z.boolean(),
  }),
]);
