import { z } from "zod";

// What one open page tells another: only what the page could already read for itself, never the
// text of anything. Each event carries who caused it, so a reader is never told about their own.
export const CONTENT_EVENTS_SCHEMA = {
  content: {
    posted: z.object({ id: z.string(), authorId: z.string() }),
    commented: z.object({
      postId: z.string(),
      authorId: z.string(),
      commentCount: z.number(),
    }),
    reacted: z.object({
      id: z.string(),
      type: z.enum(["post", "comment"]),
      postId: z.string().nullable(),
      authorId: z.string(),
      reactions: z.array(z.object({ emoji: z.string(), count: z.number() })),
    }),
    removed: z.object({
      id: z.string(),
      type: z.enum(["post", "comment"]),
      postId: z.string().nullable(),
      authorId: z.string(),
      commentCount: z.number().nullable(),
    }),
  },
};
