"use client";

import { Copy02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";

import { Icon } from "@/shared/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { tryCatch } from "@/shared/utils/try-catch";

type Props = {
  id?: string;
  value: string;
};

export const CopyToClipboard = ({ id, value }: Props) => {
  const [isCopied, setCopied] = useState(false);

  // The clipboard rejects without permission or outside a secure context
  const handleCopyToClipboard = async () => {
    const { error } = await tryCatch(navigator.clipboard.writeText(value));

    if (error) {
      toast.error("Couldn't copy", { description: "Select the text and copy it instead." });
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <InputGroup>
      <InputGroupInput id={id} value={value} readOnly />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton aria-label="Copy" size="icon-xs" onClick={handleCopyToClipboard} />
            }
          >
            <Icon icon={isCopied ? Tick02Icon : Copy02Icon} />
          </TooltipTrigger>
          <TooltipContent>{isCopied ? "Copied" : "Copy"}</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
};
