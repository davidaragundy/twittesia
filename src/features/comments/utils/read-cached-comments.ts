import type { QueryClient, QueryKey } from "@tanstack/react-query";

import { COMMENT_LIST_QUERY_ROOTS } from "@/features/comments/constants/comment-list-query-roots";
import type { CommentsData } from "@/features/comments/types/comments-data";

interface Props {
  queryClient: QueryClient;
}

// Every comment list as it stands, to put back if an optimistic change is refused
export const readCachedComments = ({
  queryClient,
}: Props): [QueryKey, CommentsData | undefined][] =>
  COMMENT_LIST_QUERY_ROOTS.flatMap((root) =>
    queryClient.getQueriesData<CommentsData>({ queryKey: [root] }),
  );
