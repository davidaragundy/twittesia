import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentSort } from "@/features/comments/types/comment-sort";

interface Props {
  postId: string;
  sort: CommentSort;
}

// Each order is cached on its own, under the prefix the cache helpers write through
export const toCommentsQueryKey = ({ postId, sort }: Props) => [COMMENTS_QUERY_KEY, postId, sort];
