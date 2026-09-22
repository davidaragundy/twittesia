import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useSendMessageMutation } from "@/features/chat/hooks/use-send-message-mutation";
import { useTypingAnnouncer } from "@/features/chat/hooks/use-typing-announcer";
import { messageFormSchema } from "@/features/chat/schemas/message-form-schema";
import type { MessageFormValues } from "@/features/chat/types/message-form-values";

interface Props {
  chatId: string;
  // Nothing can be said while the connection is down: there would be nowhere for it to go
  isConnected: boolean;
  // Nor before the two sides have agreed a key: there would be no way to close it
  chatKey: CryptoKey | null;
}

export const useChatComposer = ({ chatId, isConnected, chatKey }: Props) => {
  const form = useForm<MessageFormValues>({
    mode: "onChange",
    resolver: zodResolver(messageFormSchema),
    defaultValues: { body: "" },
  });

  const { mutate, isPending } = useSendMessageMutation({
    chatId,
    chatKey,
    // Back in the box, unless something new has been started there since
    onFailed: (text) => {
      if (!form.getValues("body")) form.setValue("body", text, { shouldValidate: true });
    },
  });
  const announceTyping = useTypingAnnouncer({ chatId });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const body = useWatch({ control: form.control, name: "body" });
  // Not held back by the message before it: people write in bursts, and the page sends one action
  // at a time, so they still leave in the order they were written
  const canSubmit = isValid && !!body?.trim() && isConnected && !!chatKey;

  // The message is cleared as it goes: it comes back over the connection like any other, so the
  // room shows what actually left rather than what was typed
  const onSubmit = ({ body: text }: MessageFormValues) => {
    mutate(text);
    form.reset({ body: "" });
  };

  // The other side is told someone is writing, never what they are writing
  const onType = () => {
    if (chatKey) announceTyping();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();

    if (canSubmit) void form.handleSubmit(onSubmit)();
  };

  return { form, onSubmit, onKeyDown, onType, isPending, canSubmit, length: body?.length ?? 0 };
};
