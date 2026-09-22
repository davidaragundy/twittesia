import { LandingFeature } from "@/features/landing/components/landing-feature";
import { LandingSectionHeading } from "@/features/landing/components/landing-section-heading";
import { LANDING_CHAT_POINTS } from "@/features/landing/constants/landing-chat-points";

// The part of the page about chats. Everything it claims is what the chat actually does.
export const LandingChat = () => (
  <section aria-labelledby="chat-title" className="flex flex-col gap-8">
    <div className="flex flex-col gap-4">
      <LandingSectionHeading
        id="chat-title"
        label="Private chat"
        title={<>Talk to one person. We can&apos;t read it.</>}
      />
      <p className="max-w-xl text-lg text-balance text-muted-foreground">
        Not &ldquo;we promise not to&rdquo;. A chat is encrypted by the two browsers in it, with a
        key we are never given, and no message is stored anywhere — so there is nothing to hand
        over, and nothing to read back.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
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
