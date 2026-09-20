import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { acceptKnock } from "@/features/chat/actions/accept-knock";
import { declineKnock } from "@/features/chat/actions/decline-knock";
import { toChatQueryKey } from "@/features/chat/utils/to-chat-query-key";

interface Props {
  chatId: string;
}

// Both answers a creator can give, as one request each: accepting spends the invite, declining
// only stops showing that person
export const useAnswerKnockMutation = ({ chatId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Both answers say only whether they landed: who was let in comes back with the chat itself
    mutationFn: async ({ identityId, accept }: { identityId: string; accept: boolean }) => {
      const { error } = accept
        ? await acceptKnock({ chatId, identityId })
        : await declineKnock({ chatId, identityId });

      return { error };
    },
    onSuccess: ({ error }) => {
      if (error) {
        toast.error("Couldn't answer", { description: error.message });
      }

      queryClient.invalidateQueries({ queryKey: toChatQueryKey({ chatId }) });
    },
    onError: () => {
      toast.error("Couldn't answer", { description: "Please try again in a moment." });
    },
  });
};
