import { Badge } from "@/shared/components/ui/badge";

import { StartButton } from "@/features/auth/components/start-button";

export const LandingHero = () => (
  <section className="flex flex-col items-center gap-8 text-center">
    <Badge variant="ghost">Open source</Badge>

    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
      Say it. In 24 hours, it&apos;s gone.
    </h1>

    <p className="max-w-lg text-base text-balance text-muted-foreground sm:text-lg">
      Posts, comments, reactions — everything you write is deleted a day later, and so is who you
      wrote it as. Or say it to one person, in a chat that is written down nowhere at all.
    </p>

    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <StartButton size="lg" />
    </div>

    <p className="max-w-md text-sm text-balance text-muted-foreground">
      No email, no password, no account. You get a name and you are in.
    </p>
  </section>
);
