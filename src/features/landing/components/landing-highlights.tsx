import { LandingFeature } from "@/features/landing/components/landing-feature";
import { LandingSectionHeading } from "@/features/landing/components/landing-section-heading";
import { LANDING_HIGHLIGHTS } from "@/features/landing/constants/landing-highlights";

export const LandingHighlights = () => (
  <section aria-labelledby="features-title" className="flex flex-col gap-8">
    <LandingSectionHeading
      id="features-title"
      label="What you can do"
      title="Everything a timeline needs. Nothing it keeps."
    />

    <div className="grid gap-3 sm:grid-cols-2">
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
