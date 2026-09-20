"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Spinner } from "@/shared/components/ui/spinner";

import { SearchResultItem } from "@/features/explore/components/search-result-item";
import { useSearchResults } from "@/features/explore/hooks/use-search-results";
import type { SearchPage } from "@/features/explore/types/search-page";
import type { SearchScope } from "@/features/explore/types/search-scope";
import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

interface Props {
  query: string;
  scope: SearchScope;
  initialPage: SearchPage;
}

export const SearchResults = ({ query, scope, initialPage }: Props) => {
  const { results, isPending, hasNextPage, isFetchingNextPage, endRef } = useSearchResults({
    query,
    scope,
    initialPage,
  });

  if (isPending) return <FeedSkeleton />;

  if (!results.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Search01Icon} />
          </EmptyMedia>
          <EmptyTitle>Nothing matches that</EmptyTitle>
          <EmptyDescription>
            Only what is still alive can be found, and everything here lives a day. Try other words.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="feed"
        aria-label="Search results"
        aria-busy={isFetchingNextPage}
        className="-mx-4 flex flex-col gap-1 sm:-mx-5"
      >
        {results.map((result, index) => (
          <SearchResultItem
            key={result.kind === "post" ? result.post.id : result.comment.id}
            result={result}
            position={index + 1}
            total={hasNextPage ? -1 : results.length}
          />
        ))}
      </div>

      {/* Scrolling this into view loads the next page */}
      <div ref={endRef} className="flex justify-center py-8">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && (
          <span className="text-sm text-muted-foreground">That&apos;s everything</span>
        )}
      </div>
    </div>
  );
};
