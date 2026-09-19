import type { z } from "zod";

import type { searchScopeSchema } from "@/features/explore/schemas/search-scope-schema";

export type SearchScope = z.infer<typeof searchScopeSchema>;
