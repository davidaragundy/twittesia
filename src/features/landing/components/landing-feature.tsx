import type { IconSvgElement } from "@hugeicons/react";

import { Icon } from "@/shared/components/icon";
import { Panel } from "@/shared/components/panel";

interface Props {
  icon: IconSvgElement;
  title: string;
  description: string;
}

// One thing Twittesia does, as a card in the grid: an icon, a name and a sentence or two
export const LandingFeature = ({ icon, title, description }: Props) => (
  <Panel className="gap-5">
    <span className="flex size-11 items-center justify-center rounded-full bg-background">
      <Icon icon={icon} className="size-5" />
    </span>
    <div className="flex flex-col gap-1.5">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </Panel>
);
