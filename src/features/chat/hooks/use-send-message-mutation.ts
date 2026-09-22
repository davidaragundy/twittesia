import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { sendMessage } from "@/features/chat/actions/send-message";
import { encryptMessage } from "@/features/chat/utils/encrypt-message";

interface Props {
  chatId: string;
  // What this page and the other side agreed on: the text is closed with it before it leaves
  chatKey: CryptoKey | null;
  // Gives back what couldn't be sent, so it isn't lost with the box already cleared
  onFailed: (body: string) => void;
}

export const useSendMessageMutation = ({ chatId, chatKey, onFailed }: Props) =>
  useMutation({
    mutationFn: async (body: string) => {
      // Nothing is sent before the two sides have agreed a key; the composer waits for it too
      if (!chatKey) throw new Error("This chat has no key yet");

      const { cipher, iv } = await encryptMessage({ key: chatKey, body });

      return sendMessage({ chatId, cipher, iv });
    },
    onSuccess: ({ error }, body) => {
      if (!error) return;

      onFailed(body);
      toast.error("Couldn't send that", { description: error.message });
    },
    onError: (_error, body) => {
      onFailed(body);
      toast.error("Couldn't send that", { description: "Please try again in a moment." });
    },
  });
