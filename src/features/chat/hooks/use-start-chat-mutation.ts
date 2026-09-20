import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { startChat } from "@/features/chat/actions/start-chat";
import { generateInviteSecret } from "@/features/chat/utils/generate-invite-secret";
import { toChatPath } from "@/features/chat/utils/to-chat-path";
import { toSecretStorageKey } from "@/features/chat/utils/to-secret-storage-key";

// The secret is made here, in the browser, and kept in this tab: the chat that comes back from
// the server has no idea it exists
export const useStartChatMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: startChat,
    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error("Couldn't start the chat", { description: error.message });
        return;
      }

      sessionStorage.setItem(toSecretStorageKey({ chatId: data.id }), generateInviteSecret());
      router.push(toChatPath({ id: data.id }));
    },
    onError: () => {
      toast.error("Couldn't start the chat", { description: "Please try again in a moment." });
    },
  });
};
