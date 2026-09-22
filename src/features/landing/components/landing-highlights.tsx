import { LandingFeature } from "@/features/landing/components/landing-feature";
import { LANDING_HIGHLIGHTS } from "@/features/landing/constants/landing-highlights";

export const LandingHighlights = () => (
  <section aria-labelledby="features-title" className="flex flex-col gap-8">
    <h2 id="features-title" className="text-sm font-medium text-muted-foreground">
      What you can do
    </h2>

    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {LANDING_HIGHLIGHTS.map((highlight) => (
        <LandingFeature
          key={highlight.title}
          icon={highlight.icon}
          title={highlight.title}
          description={highlight.description}
        />
      ))}
    </div>
  </section>
);
