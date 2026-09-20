"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import { useBackButton } from "@/shared/hooks/use-back-button";

type Props = {
  fallbackHref: string;
  label: string;
};

export function BackButton({ fallbackHref, label }: Props) {
  const { goBack } = useBackButton({ fallbackHref });

  return (
    <Button variant="ghost" onClick={goBack} className="-ml-3 self-start">
      <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
      {label}
    </Button>
  );
}
