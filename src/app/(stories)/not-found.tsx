import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { TypographyH1 } from "@/shared/components/typography";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <TypographyH1 className="text-center">Page not found</TypographyH1>

      <Link href="/home" className="flex items-center gap-2">
        <HugeiconsIcon icon={Home01Icon} /> Go to home
      </Link>
    </div>
  );
}
