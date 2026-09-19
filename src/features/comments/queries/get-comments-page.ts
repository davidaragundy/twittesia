import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants/comments-page-size";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import type { PostComment } from "@/features/comments/types/post-comment";
import { toPostComment } from "@/features/comments/utils/to-post-comment";
import { queryContentPage } from "@/features/posts/utils/query-content-page";

interface Props {
  postId: string;
  cursor?: string | null;
  sort?: CommentSort;
  viewerId?: string | null;
}

// A post's comments. They expire with their post, so an expired post has none to show.
export const getCommentsPage = async ({
  postId,
  cursor,
  sort = DEFAULT_COMMENT_SORT,
  viewerId,
}: Props): Promise<ActionResponse<CommentsPage, "FAILED_TO_LOAD_COMMENTS">> => {
  const { data, error } = await queryContentPage({
    filter: { type: "comment", postId },
    sort,
    cursor,
    pageSize: COMMENTS_PAGE_SIZE,
    viewerId,
  });

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_COMMENTS", message: "Couldn't load the comments" },
    };
  }

  return {
    data: {
      comments: data.reads
        .map(({ hash, mine }) => toPostComment({ hash, viewerId, mine }))
        .filter((comment): comment is PostComment => comment !== null),
      nextCursor: data.nextCursor,
    },
    error: null,
  };
};
