import { CornerDownRightIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/shared/components/icon";

import { CommentItem } from "@/features/comments/components/comment-item";
import type { ProfileComment } from "@/features/comments/types/profile-comment";
import { getPostPath } from "@/features/posts/utils/get-post-path";

interface Props {
  comment: ProfileComment;
}

// A comment away from the post it was written on, with a way back to that post
export const ProfileCommentItem = ({ comment }: Props) => (
  <div className="flex flex-col">
    {comment.postAuthorUsername && (
      <Link
        href={getPostPath({ username: comment.postAuthorUsername, postId: comment.postId })}
        className="flex w-fit items-center gap-1.5 pt-2 pl-11 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon icon={CornerDownRightIcon} className="size-3.5" />
        Reply to a post
      </Link>
    )}

    <CommentItem comment={comment} />
  </div>
);
