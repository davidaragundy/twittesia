import { ClockFace } from "@/shared/components/clock-face";
import { Panel } from "@/shared/components/panel";

import { StartButton } from "@/features/auth/components/start-button";

// How the landing opens, the way each of its sections does: a small label and a large line, with
// the one thing that makes Twittesia what it is drawn beside them
export const LandingHero = () => (
  <section aria-labelledby="hero-title" className="grid items-center gap-10 lg:grid-cols-2">
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Open source · No account
      </p>
      <h1
        id="hero-title"
        className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
      >
        Say it. In 24 hours, it&apos;s gone.
      </h1>
      <p className="max-w-lg text-lg leading-relaxed text-balance text-muted-foreground">
        Posts, comments, reactions — everything you write is deleted a day later, and so is who you
        wrote it as. Or say it to one person, in a chat that is written down nowhere at all.
      </p>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-5">
        <StartButton size="lg" />
        <p className="text-sm text-muted-foreground">No email, no password. You get a name.</p>
      </div>
    </div>

    {/* Every post carries this clock; here it is large enough to read the idea from */}
    <Panel className="items-center gap-8 rounded-4xl py-12 text-center sm:py-16">
      <ClockFace remaining={0.7} size={176} isEmphasized />
      <div className="flex flex-col gap-1.5">
        <p className="text-3xl font-bold tracking-tight tabular-nums">Gone in 16h 48m</p>
        <p className="text-sm text-muted-foreground">Every post and every identity runs on one.</p>
      </div>
    </Panel>
  </section>
);
