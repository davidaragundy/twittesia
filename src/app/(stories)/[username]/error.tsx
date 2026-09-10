"use client";

import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/shared/components/ui/button";
import { TypographyH1 } from "@/shared/components/ui/typography";

interface Props {
  reset: () => void;
}

export default function Error({ reset }: Props) {
  useEffect(() => {
    document.title = "Twittesia | Error";
  }, []);

  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <TypographyH1 className="text-center">Something went wrong!</TypographyH1>

      <Button onClick={reset} className="flex items-center gap-2">
        <HugeiconsIcon icon={ArrowReloadHorizontalIcon} /> Reload page
      </Button>
    </div>
  );
}
