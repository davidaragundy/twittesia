import { LIFESPAN_STEPS } from "@/features/landing/constants/lifespan-steps";

export const LandingLifespan = () => (
  <section aria-labelledby="lifespan-title" className="flex flex-col gap-8">
    <h2 id="lifespan-title" className="text-sm font-medium text-muted-foreground">
      The lifespan of everything
    </h2>

    <ol className="grid gap-10 sm:grid-cols-3">
      {LIFESPAN_STEPS.map((step) => (
        <li key={step.time} className="flex flex-col gap-1">
          <span className="text-2xl font-semibold tracking-tight">{step.time}</span>
          <span className="text-muted-foreground">{step.label}</span>
        </li>
      ))}
    </ol>

    <p className="max-w-xl text-sm text-muted-foreground">
      A chat is shorter still: it ends within a day like everything else, and what is said in it is
      never written down in the first place.
    </p>
  </section>
);
