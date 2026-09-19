import { SEARCH_QUERY_KEY } from "@/features/explore/constants/search-query-key";
import type { SearchScope } from "@/features/explore/types/search-scope";

interface Props {
  query: string;
  scope: SearchScope;
}

// Each search, in each scope, is cached on its own
export const toSearchQueryKey = ({ query, scope }: Props) => [
  ...SEARCH_QUERY_KEY,
  { query, scope },
];
