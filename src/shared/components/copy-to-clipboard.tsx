"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy02Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/shared/components/ui/input-group";

export const CopyToClipboard = ({ value }: { value: string }) => {
  const [isCopied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <InputGroup>
      <InputGroupInput placeholder={value} readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Copy"
          title="Copy"
          size="icon-xs"
          onClick={handleCopyToClipboard}
        >
          {isCopied ? <HugeiconsIcon icon={Tick02Icon} /> : <HugeiconsIcon icon={Copy02Icon} />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
