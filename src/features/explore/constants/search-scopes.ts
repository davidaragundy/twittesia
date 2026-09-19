// What a search can be narrowed to; the first is what a search starts as
export const SEARCH_SCOPES = [
  { value: "all", label: "Everything" },
  { value: "posts", label: "Posts" },
  { value: "comments", label: "Comments" },
] as const;
