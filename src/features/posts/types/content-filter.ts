import type { getContentIndex } from "@/features/posts/utils/get-content-index";

// What a query on the content index may filter by
export type ContentFilter = NonNullable<
  NonNullable<Parameters<ReturnType<typeof getContentIndex>["query"]>[0]>["filter"]
>;
