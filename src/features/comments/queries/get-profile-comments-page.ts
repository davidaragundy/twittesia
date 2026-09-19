import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants/comments-page-size";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { ProfileComment } from "@/features/comments/types/profile-comment";
import type { ProfileCommentsPage } from "@/features/comments/types/profile-comments-page";
import { toPostComment } from "@/features/comments/utils/to-post-comment";
import { queryContentPage } from "@/features/posts/utils/query-content-page";

interface Props {
  authorId: string;
  cursor?: string | null;
  sort?: CommentSort;
  viewerId?: string | null;
}

// One person's comments, wherever they wrote them, each knowing whose post it was left on
export const getProfileCommentsPage = async ({
  authorId,
  cursor,
  sort = DEFAULT_COMMENT_SORT,
  viewerId,
}: Props): Promise<ActionResponse<ProfileCommentsPage, "FAILED_TO_LOAD_COMMENTS">> => {
  const { data, error } = await queryContentPage({
    filter: { type: "comment", authorId },
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
      comments: data.reads.flatMap(({ hash, mine }): ProfileComment[] => {
        const comment = toPostComment({ hash, viewerId, mine });

        return comment ? [{ ...comment, postAuthorUsername: hash?.postAuthorHandle || null }] : [];
      }),
      nextCursor: data.nextCursor,
    },
    error: null,
  };
};
