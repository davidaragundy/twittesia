import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { sendMessage } from "@/features/chat/actions/send-message";

interface Props {
  chatId: string;
}

export const useSendMessageMutation = ({ chatId }: Props) => {
  return useMutation({
    mutationFn: (body: string) => sendMessage({ chatId, body }),
    onSuccess: ({ error }) => {
      if (error) toast.error("Couldn't send that", { description: error.message });
    },
    onError: () => {
      toast.error("Couldn't send that", { description: "Please try again in a moment." });
    },
  });
};
