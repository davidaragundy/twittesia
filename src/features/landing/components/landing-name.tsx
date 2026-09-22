import { LandingSectionHeading } from "@/features/landing/components/landing-section-heading";

export const LandingName = () => (
  <section aria-labelledby="name-title" className="flex flex-col gap-8">
    <div className="flex flex-col gap-4">
      <LandingSectionHeading
        id="name-title"
        label="Why Twittesia"
        title={
          <>
            Twitter <span className="text-muted-foreground">+</span> amnesia.
          </>
        }
      />
      <p className="max-w-xl text-lg text-balance text-muted-foreground">
        A timeline that forgets. Say what you think today; by tomorrow it has faded, and
        yesterday&apos;s take stays in yesterday.
      </p>
    </div>
  </section>
);
