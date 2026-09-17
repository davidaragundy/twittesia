import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";

interface Props {
  postId: string;
}

// Every order of one post's comments, for the reads and writes that hold for all of them
export const toCommentsQueryPrefix = ({ postId }: Props) => [COMMENTS_QUERY_KEY, postId];
