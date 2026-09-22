import { LandingFeature } from "@/features/landing/components/landing-feature";
import { LANDING_CHAT_POINTS } from "@/features/landing/constants/landing-chat-points";

// The part of the page about chats. Everything it claims is what the chat actually does.
export const LandingChat = () => (
  <section aria-labelledby="chat-title" className="flex flex-col gap-8">
    <h2 id="chat-title" className="text-sm font-medium text-muted-foreground">
      Private chat
    </h2>

    <div className="flex flex-col gap-4">
      <p className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Talk to one person. We can&apos;t read it.
      </p>
      <p className="max-w-xl text-lg text-balance text-muted-foreground">
        Not &ldquo;we promise not to&rdquo;. A chat is encrypted by the two browsers in it, with a
        key we are never given, and no message is stored anywhere — so there is nothing to hand
        over, and nothing to read back.
      </p>
    </div>

    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {LANDING_CHAT_POINTS.map((point) => (
        <LandingFeature
          key={point.title}
          icon={point.icon}
          title={point.title}
          description={point.description}
        />
      ))}
    </div>
  </section>
);
