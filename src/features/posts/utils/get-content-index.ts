import "server-only";

import { redis } from "@/shared/lib/redis/server";

import { CONTENT_INDEX } from "@/features/posts/constants/content-index";

// A handle on the search index; creating one costs nothing, only its queries do
export const getContentIndex = () =>
  redis.search.index({ name: CONTENT_INDEX.name, schema: CONTENT_INDEX.schema });
