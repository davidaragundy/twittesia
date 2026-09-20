export const LandingName = () => (
  <section aria-labelledby="name-title" className="flex flex-col gap-8">
    <h2 id="name-title" className="text-sm font-medium text-muted-foreground">
      Why Twittesia
    </h2>

    <div className="flex flex-col gap-4">
      <p className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Twitter <span className="text-muted-foreground">+</span> amnesia.
      </p>
      <p className="max-w-xl text-lg text-balance text-muted-foreground">
        A timeline that forgets. Say what you think today; by tomorrow it has faded, and
        yesterday&apos;s take stays in yesterday.
      </p>
    </div>
  </section>
);
