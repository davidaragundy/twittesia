import { PROFILE_COMMENTS_QUERY_KEY } from "@/features/comments/constants/profile-comments-query-key";
import type { CommentSort } from "@/features/comments/types/comment-sort";

interface Props {
  username: string;
  sort: CommentSort;
}

export const toProfileCommentsQueryKey = ({ username, sort }: Props) => [
  PROFILE_COMMENTS_QUERY_KEY,
  username,
  sort,
];
