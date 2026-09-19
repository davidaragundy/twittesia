import "server-only";

import { tryCatch } from "@/shared/utils/try-catch";

import { realtime } from "@/features/posts/lib/realtime";

interface Props {
  id: string;
  authorId: string;
}

// Tells open feeds a post exists. They offer it rather than showing it, and read it themselves.
export const emitContentPosted = async ({ id, authorId }: Props) => {
  await tryCatch(realtime.emit("content.posted", { id, authorId }));
};
