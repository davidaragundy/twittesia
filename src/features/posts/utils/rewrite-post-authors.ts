import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { REWRITE_IF_EXISTS_SCRIPT } from "@/features/posts/constants/rewrite-if-exists-script";
import { getContentIndex } from "@/features/posts/utils/get-content-index";

interface Props {
  authorId: string;
  // What changed; the other stays as it is
  author: { handle?: string; name?: string };
}

// Every live post of an author carries a copy of their handle and name; renaming rewrites them
export const rewritePostAuthors = async ({
  authorId,
  author,
}: Props): Promise<ActionResponse<null, "FAILED_TO_REWRITE_POSTS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_REWRITE_POSTS" as const, message: "Couldn't update your posts" },
  };

  const fields = [
    ...(author.handle ? ["authorHandle", author.handle] : []),
    ...(author.name ? ["authorName", author.name] : []),
  ];

  const { data: posts, error } = await tryCatch(
    getContentIndex().query({ filter: { type: "post", authorId }, select: {}, limit: 1000 }),
  );

  if (error) return failure;
  if (!posts.length || !fields.length) return { data: null, error: null };

  const { error: writeError } = await tryCatch(
    redis.eval(
      REWRITE_IF_EXISTS_SCRIPT,
      posts.map((post) => post.key),
      fields,
    ),
  );

  if (writeError) return failure;

  return { data: null, error: null };
};
