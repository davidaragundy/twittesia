import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { endChat } from "@/features/chat/actions/end-chat";
import { CHATS_PATH } from "@/features/chat/constants/chats-path";

interface Props {
  chatId: string;
}

export const useEndChatMutation = ({ chatId }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => endChat({ chatId }),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error("Couldn't end the chat", { description: error.message });
        return;
      }

      router.push(CHATS_PATH);
    },
    onError: () => {
      toast.error("Couldn't end the chat", { description: "Please try again in a moment." });
    },
  });
};
