import { useState } from "react";

import { useDeletePostMutation } from "@/features/posts/hooks/use-delete-post-mutation";
import { getPostExpiry } from "@/features/posts/utils/get-post-expiry";

interface Props {
  postId: string;
  createdAt: Date;
  onDeleted?: () => void;
}

export const usePostItem = ({ postId, createdAt, onDeleted }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate, isPending } = useDeletePostMutation();

  // The post leaves the feed optimistically, so the dialog closes with it
  const confirmDelete = () => {
    mutate(postId, { onSuccess: ({ error }) => !error && onDeleted?.() });
    setIsDeleteOpen(false);
  };

  return {
    expiresAt: getPostExpiry({ createdAt }),
    isDeleteOpen,
    onDeleteOpenChange: setIsDeleteOpen,
    requestDelete: () => setIsDeleteOpen(true),
    confirmDelete,
    isDeleting: isPending,
  };
};
