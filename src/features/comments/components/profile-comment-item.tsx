import Link from "next/link";

import { CommentItem } from "@/features/comments/components/comment-item";
import type { ProfileComment } from "@/features/comments/types/profile-comment";
import { getPostPath } from "@/features/posts/utils/get-post-path";

interface Props {
  comment: ProfileComment;
}

// A comment away from the post it was written on, so it says which post that was
export const ProfileCommentItem = ({ comment }: Props) => (
  <div className="flex flex-col">
    {comment.postAuthorUsername && (
      <Link
        href={getPostPath({ username: comment.postAuthorUsername, postId: comment.postId })}
        className="pt-2 pl-11 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        On <span className="handle">@{comment.postAuthorUsername}</span>
        &apos;s post
      </Link>
    )}

    <CommentItem comment={comment} />
  </div>
);
