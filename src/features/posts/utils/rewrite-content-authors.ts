import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { REWRITE_IF_EXISTS_SCRIPT } from "@/features/posts/constants/rewrite-if-exists-script";
import { queryContentKeys } from "@/features/posts/utils/query-content-keys";

interface Props {
  authorId: string;
  // What changed; the other stays as it is
  author: { handle?: string; name?: string };
}

// Every live post and comment of an author carries a copy of their handle and name; renaming
// rewrites them
export const rewriteContentAuthors = async ({
  authorId,
  author,
}: Props): Promise<ActionResponse<null, "FAILED_TO_REWRITE_CONTENT">> => {
  const failure = {
    data: null,
    error: {
      code: "FAILED_TO_REWRITE_CONTENT" as const,
      message: "Couldn't update your posts and comments",
    },
  };

  const fields = [
    ...(author.handle ? ["authorHandle", author.handle] : []),
    ...(author.name ? ["authorName", author.name] : []),
  ];

  const { data: keys, error } = await queryContentKeys({ filter: { authorId } });

  if (error) return failure;
  if (!keys.length || !fields.length) return { data: null, error: null };

  const { error: writeError } = await tryCatch(redis.eval(REWRITE_IF_EXISTS_SCRIPT, keys, fields));

  if (writeError) return failure;

  return { data: null, error: null };
};
