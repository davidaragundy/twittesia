import { useState } from "react";

import { useDeletePostMutation } from "@/features/posts/hooks/use-delete-post-mutation";

interface Props {
  postId: string;
}

export const usePostItem = ({ postId }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate, isPending } = useDeletePostMutation();

  // The post leaves the feed optimistically, so the dialog closes with it
  const confirmDelete = () => {
    mutate(postId);
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
