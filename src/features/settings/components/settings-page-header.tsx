import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { TypographyH3, TypographyMuted } from "@/shared/components/typography";

type Props = {
  title: string;
  description: string;
};

export const SettingsPageHeader = ({ title, description }: Props) => {
  return (
    <div className="sticky top-0 pb-2 backdrop-blur-sm md:static md:pb-0 md:backdrop-blur-none">
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
