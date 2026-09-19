import { z } from "zod";

import { MAX_SEARCH_QUERY_LENGTH } from "@/features/explore/constants/max-search-query-length";

// What someone typed, as it reaches the server: trimmed, and empty for anything too long to be a
// search rather than a page to read
export const searchQuerySchema = z
  .string()
  .trim()
  .max(MAX_SEARCH_QUERY_LENGTH)
  .catch("")
  .default("");
