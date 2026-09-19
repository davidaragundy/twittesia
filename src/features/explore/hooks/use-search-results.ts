import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import type { SearchPage } from "@/features/explore/types/search-page";
import type { SearchScope } from "@/features/explore/types/search-scope";
import { fetchSearchPage } from "@/features/explore/utils/fetch-search-page";
import { toSearchQueryKey } from "@/features/explore/utils/to-search-query-key";

interface Props {
  query: string;
  scope: SearchScope;
  // Read on the server, so the first results are there on the first paint
  initialPage: SearchPage;
}

export const useSearchResults = ({ query, scope, initialPage }: Props) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: toSearchQueryKey({ query, scope }),
      queryFn: ({ pageParam }) => fetchSearchPage({ query, scope, offset: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage: SearchPage) => lastPage.nextOffset,
      initialData: { pages: [initialPage], pageParams: [0] },
      enabled: !!query,
    });

  // Loads the next page once the end of the list comes into view
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const end = endRef.current;

    if (!end || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) fetchNextPage();
    });

    observer.observe(end);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const results = data?.pages.flatMap((page) => page.results) ?? [];

  return {
    results,
    isPending,
    isError: !!error,
    hasNextPage,
    isFetchingNextPage,
    endRef,
  };
};
