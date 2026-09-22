import type { IconSvgElement } from "@hugeicons/react";

import { Icon } from "@/shared/components/icon";

interface Props {
  icon: IconSvgElement;
  title: string;
  description: string;
}

// One thing Twittesia does, said in full: an icon, a name and a sentence or two
export const LandingFeature = ({ icon, title, description }: Props) => (
  <div className="flex gap-4">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
      <Icon icon={icon} className="size-5" />
    </span>
    <div className="flex flex-col gap-1 pt-2">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </div>
);
