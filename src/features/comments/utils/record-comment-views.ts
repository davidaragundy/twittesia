import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { toCommentKey } from "@/features/comments/utils/to-comment-key";
import { recordViews } from "@/features/posts/utils/record-views";

interface Props {
  commentIds: string[];
  viewerId: string;
}

// Skips the viewer's own comments and expired ones; a view already counted stays as it is
export const recordCommentViews = ({
  commentIds,
  viewerId,
}: Props): Promise<ActionResponse<{ recorded: number }, "FAILED_TO_RECORD_VIEWS">> =>
  recordViews({ targetKeys: commentIds.map((id) => toCommentKey({ id })), viewerId });
