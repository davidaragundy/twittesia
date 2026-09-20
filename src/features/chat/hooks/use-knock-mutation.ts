import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { knock } from "@/features/chat/actions/knock";
import { toChatQueryKey } from "@/features/chat/utils/to-chat-query-key";

interface Props {
  chatId: string;
}

export const useKnockMutation = ({ chatId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => knock({ chatId }),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error("Couldn't ask to join", { description: error.message });
        return;
      }

      queryClient.invalidateQueries({ queryKey: toChatQueryKey({ chatId }) });
    },
    onError: () => {
      toast.error("Couldn't ask to join", { description: "Please try again in a moment." });
    },
  });
};
