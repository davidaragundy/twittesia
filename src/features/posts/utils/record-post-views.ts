import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { recordViews } from "@/features/posts/utils/record-views";
import { toPostKey } from "@/features/posts/utils/to-post-key";

interface Props {
  postIds: string[];
  viewerId: string;
}

// Skips the viewer's own posts and expired ones; a view already counted is left as it is
export const recordPostViews = ({
  postIds,
  viewerId,
}: Props): Promise<ActionResponse<{ recorded: number }, "FAILED_TO_RECORD_VIEWS">> =>
  recordViews({ targetKeys: postIds.map((id) => toPostKey({ id })), viewerId });
