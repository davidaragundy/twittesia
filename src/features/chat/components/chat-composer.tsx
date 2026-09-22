"use client";

import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { Controller } from "react-hook-form";

import { CharacterCountRing } from "@/shared/components/character-count-ring";
import { Icon } from "@/shared/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";
import { Kbd, KbdGroup } from "@/shared/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants/max-message-length";
import { useChatComposer } from "@/features/chat/hooks/use-chat-composer";

interface Props {
  chatId: string;
  isConnected: boolean;
  // What the two sides agreed on, once they have: there is no sending before that
  chatKey: CryptoKey | null;
}

export const ChatComposer = ({ chatId, isConnected, chatKey }: Props) => {
  const { form, onSubmit, onKeyDown, onType, canSubmit, length } = useChatComposer({
    chatId,
    isConnected,
    chatKey,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="body"
        control={form.control}
        render={({ field }) => (
          <InputGroup>
            <label htmlFor="chat-composer-body" className="sr-only">
              Say something
            </label>
            {/* One line, like a message, growing with what is written */}
            <InputGroupTextarea
              {...field}
              id="chat-composer-body"
              rows={1}
              placeholder={!isConnected ? "Reconnecting…" : chatKey ? "Message" : "Agreeing a key…"}
              onChange={(event) => {
                field.onChange(event);
                onType();
              }}
              onKeyDown={onKeyDown}
              className="max-h-40 min-h-0"
            />
            <InputGroupAddon align="inline-end">
              <CharacterCountRing length={length} max={MAX_MESSAGE_LENGTH} />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="icon-sm"
                      disabled={!canSubmit}
                      aria-label="Send"
                    />
                  }
                >
                  <Icon icon={ArrowUp02Icon} />
                </TooltipTrigger>
                <TooltipContent>
                  Send
                  <KbdGroup>
                    <Kbd>Enter</Kbd>
                  </KbdGroup>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        )}
      />
    </form>
  );
};
