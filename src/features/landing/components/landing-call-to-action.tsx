import { StartButton } from "@/features/auth/components/start-button";

export const LandingCallToAction = () => (
  <section className="flex flex-col items-center gap-6 rounded-4xl bg-muted/30 px-6 py-16 text-center sm:py-24">
    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
      Nothing to regret tomorrow.
    </h2>

    <StartButton size="lg" />
  </section>
);
