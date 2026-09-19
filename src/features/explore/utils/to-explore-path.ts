import { EXPLORE_PATH } from "@/features/explore/constants/explore-path";
import { SEARCH_QUERY_PARAM } from "@/features/explore/constants/search-query-param";
import { SEARCH_SCOPE_PARAM } from "@/features/explore/constants/search-scope-param";
import { SEARCH_SCOPES } from "@/features/explore/constants/search-scopes";
import type { SearchScope } from "@/features/explore/types/search-scope";

interface Props {
  query: string;
  scope: SearchScope;
}

// The URL of one search, so it can be shared, reloaded and gone back to
export const toExplorePath = ({ query, scope }: Props) => {
  const params = new URLSearchParams();

  if (query) params.set(SEARCH_QUERY_PARAM, query);
  if (scope !== SEARCH_SCOPES[0].value) params.set(SEARCH_SCOPE_PARAM, scope);

  const search = params.toString();

  return search ? `${EXPLORE_PATH}?${search}` : EXPLORE_PATH;
};
