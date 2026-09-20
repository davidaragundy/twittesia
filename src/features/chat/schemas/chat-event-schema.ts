import { z } from "zod";

import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants/max-message-length";

/**
 * Everything that travels on a chat's channel.
 *
 * It is parsed on the way in as well as on the way out: a channel is only as trustworthy as
 * whoever can publish to it, and a page should never render something shaped differently to what
 * it expects.
 */
export const chatEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("message"),
    id: z.uuid(),
    authorId: z.uuid(),
    body: z.string().min(1).max(MAX_MESSAGE_LENGTH),
    sentAt: z.number(),
  }),
  z.object({
    type: z.literal("here"),
    identityId: z.uuid(),
    // Whether whoever is already here should say so back
    reply: z.boolean(),
  }),
  z.object({ type: z.literal("away"), identityId: z.uuid() }),
]);
