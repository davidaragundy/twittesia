import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { PopularPosts } from "@/features/explore/components/popular-posts";
import { SearchForm } from "@/features/explore/components/search-form";
import { SearchLimited } from "@/features/explore/components/search-limited";
import { SearchResults } from "@/features/explore/components/search-results";
import { searchRateLimits } from "@/features/explore/lib/search-rate-limits";
import { getSearchPage } from "@/features/explore/queries/get-search-page";
import { searchQuerySchema } from "@/features/explore/schemas/search-query-schema";
import { searchScopeSchema } from "@/features/explore/schemas/search-scope-schema";

interface Props {
  searchParams: Promise<{ q?: string; in?: string }>;
}

// Reads the first page of results on the server, so a shared search is there on the first paint.
// It reads the request, so render it inside a <Suspense> boundary.
export async function ExplorePage({ searchParams }: Props) {
  const { q, in: scopeParam } = await searchParams;
  const query = searchQuerySchema.parse(q ?? "");
  const scope = searchScopeSchema.parse(scopeParam);
  const session = await getSession();

  // Counted here too, so reloading a search is held to the same limit as scrolling one
  const isLimited =
    !!query && (await isRateLimited({ limits: searchRateLimits, identityId: session?.user.id }));

  const { data } = isLimited
    ? { data: null }
    : await getSearchPage({ query, scope, viewerId: session?.user.id });

  return (
    <div className="flex flex-col gap-10">
      <SearchForm query={query} scope={scope} />

      {isLimited && <SearchLimited />}

      {!isLimited && !!query && (
        <SearchResults
          key={`${query}:${scope}`}
          query={query}
          scope={scope}
          initialPage={data ?? { results: [], nextOffset: null }}
        />
      )}

      {!isLimited && !query && <PopularPosts />}
    </div>
  );
}
