import { StartButton } from "@/features/auth/components/start-button";

export const LandingCallToAction = () => (
  <section className="flex flex-col items-center gap-6 text-center">
    <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
      Nothing to regret tomorrow.
    </h2>

    <StartButton size="lg" />
  </section>
);
