import { LandingSectionHeading } from "@/features/landing/components/landing-section-heading";
import { LIFESPAN_STEPS } from "@/features/landing/constants/lifespan-steps";

export const LandingLifespan = () => (
  <section aria-labelledby="lifespan-title" className="flex flex-col gap-8">
    <LandingSectionHeading
      id="lifespan-title"
      label="The lifespan of everything"
      title="Written, lived, gone."
    />

    <ol className="grid gap-3 sm:grid-cols-3">
      {LIFESPAN_STEPS.map((step) => (
        <li key={step.time} className="flex flex-col gap-2 rounded-3xl bg-muted/30 p-5 sm:p-6">
          <span className="text-4xl font-bold tracking-tight">{step.time}</span>
          <span className="text-sm leading-relaxed text-muted-foreground">{step.label}</span>
        </li>
      ))}
    </ol>

    <p className="max-w-xl text-sm text-muted-foreground">
      A chat is shorter still: it ends within a day like everything else, and what is said in it is
      never written down in the first place.
    </p>
  </section>
);
