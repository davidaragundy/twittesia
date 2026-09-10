import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { TypographyH3, TypographyMuted } from "@/shared/components/ui/typography";

type Props = {
  title: string;
  description: string;
};

export const SettingsPageHeader = ({ title, description }: Props) => {
  return (
    <div className="sticky top-0 backdrop-blur-sm pb-2 md:static md:backdrop-blur-none md:pb-0">
      <TypographyH3 className="flex items-center gap-2">
        <Link href="/settings" className="md:hidden">
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Link>
        {title}
      </TypographyH3>

      <TypographyMuted>{description}</TypographyMuted>
    </div>
  );
};
