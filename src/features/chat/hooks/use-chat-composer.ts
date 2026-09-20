import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useSendMessageMutation } from "@/features/chat/hooks/use-send-message-mutation";
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

  const { mutate, isPending } = useSendMessageMutation({ chatId, chatKey });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const body = useWatch({ control: form.control, name: "body" });
  const canSubmit = isValid && !!body?.trim() && !isPending && isConnected && !!chatKey;

  // The message is cleared as it goes: it comes back over the connection like any other, so the
  // room shows what actually left rather than what was typed
  const onSubmit = ({ body: text }: MessageFormValues) => {
    mutate(text);
    form.reset({ body: "" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();

    if (canSubmit) void form.handleSubmit(onSubmit)();
  };

  return { form, onSubmit, onKeyDown, isPending, canSubmit, length: body?.length ?? 0 };
};
