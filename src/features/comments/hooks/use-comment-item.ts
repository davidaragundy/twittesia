import { useState } from "react";

import { useDeleteCommentMutation } from "@/features/comments/hooks/use-delete-comment-mutation";

interface Props {
  postId: string;
  commentId: string;
}

export const useCommentItem = ({ postId, commentId }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate, isPending } = useDeleteCommentMutation({ postId });

  // The comment leaves the list optimistically, so the dialog closes with it
  const confirmDelete = () => {
    mutate(commentId);
    setIsDeleteOpen(false);
  };

  return {
    isDeleteOpen,
    onDeleteOpenChange: setIsDeleteOpen,
    requestDelete: () => setIsDeleteOpen(true),
    confirmDelete,
    isDeleting: isPending,
  };
};
