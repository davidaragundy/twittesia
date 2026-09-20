import { HugeiconsIcon } from "@hugeicons/react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

import { LANDING_HIGHLIGHTS } from "@/features/landing/constants/landing-highlights";

export const LandingHighlights = () => (
  <section aria-labelledby="features-title" className="flex flex-col gap-8">
    <h2 id="features-title" className="text-sm font-medium text-muted-foreground">
      What you can do
    </h2>

    <div className="grid gap-8 sm:grid-cols-2">
      {LANDING_HIGHLIGHTS.map((highlight) => (
        <Item key={highlight.title}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={highlight.icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <h3>{highlight.title}</h3>
            </ItemTitle>
            <ItemDescription variant="full">{highlight.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  </section>
);
