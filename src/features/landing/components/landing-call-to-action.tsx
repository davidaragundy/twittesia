import { StartButton } from "@/features/auth/components/start-button";

export const LandingCallToAction = () => (
  <section className="flex flex-col items-center gap-6 rounded-3xl bg-muted/30 px-6 py-16 text-center sm:py-20">
    <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
      Nothing to regret tomorrow.
    </h2>

    <StartButton size="lg" />
  </section>
);
