import { z } from "zod";

import { SEARCH_SCOPES } from "@/features/explore/constants/search-scopes";

// The kind a search is narrowed to; anything else reads as everything rather than failing
export const searchScopeSchema = z
  .enum(SEARCH_SCOPES.map((scope) => scope.value))
  .catch(SEARCH_SCOPES[0].value);
