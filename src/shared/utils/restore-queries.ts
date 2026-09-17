import type { QueryClient, QueryKey } from "@tanstack/react-query";

interface Props<Data> {
  queryClient: QueryClient;
  // What a set of queries held before an optimistic change, as getQueriesData returns them
  queries: [QueryKey, Data | undefined][] | undefined;
}

export const restoreQueries = <Data>({ queryClient, queries }: Props<Data>) => {
  for (const [queryKey, data] of queries ?? []) queryClient.setQueryData(queryKey, data);
};
