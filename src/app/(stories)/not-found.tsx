import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon } from "@hugeicons/core-free-icons";

import { TypographyH1 } from "@/shared/components/ui/typography";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <TypographyH1 className="text-center">Page not found</TypographyH1>

      <Link href="/home" className="flex items-center gap-2">
        <HugeiconsIcon icon={Home01Icon} /> Go to home
      </Link>
    </div>
  );
}
