"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";

import { TypographyH1 } from "@/shared/components/typography";
import { Button } from "@/shared/components/ui/button";

interface Props {
  reset: () => void;
}

export default function Error({ reset }: Props) {
  useEffect(() => {
    document.title = "Twittesia | Error";
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <TypographyH1 className="text-center">Something went wrong!</TypographyH1>

      <Button onClick={reset} className="flex items-center gap-2">
        <HugeiconsIcon icon={ArrowReloadHorizontalIcon} /> Reload page
      </Button>
    </div>
  );
}
