import { useState } from "react";

import { useEndChatMutation } from "@/features/chat/hooks/use-end-chat-mutation";

interface Props {
  chatId: string;
}

export const useEndChatDialog = ({ chatId }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { mutate, isPending } = useEndChatMutation({ chatId });

  return {
    isOpen,
    isPending,
    // Closing mid-request would leave the spinner nowhere to live
    onOpenChange: (open: boolean) => {
      if (!isPending) setOpen(open);
    },
    confirm: () => {
      if (!isPending) mutate();
    },
  };
};
