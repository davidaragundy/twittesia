import { BubbleChatLockIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";

import { StartChatButton } from "@/features/chat/components/start-chat-button";

// A way into a private chat from anywhere, beside the feed on a wide screen
export const ChatCard = () => (
  <section
    aria-labelledby="chat-card-title"
    className="flex flex-col gap-4 rounded-3xl bg-muted/30 p-5"
  >
    <span className="flex size-10 items-center justify-center rounded-full bg-background">
      <Icon icon={BubbleChatLockIcon} className="size-5" />
    </span>
    <div className="flex flex-col gap-1">
      <h2 id="chat-card-title" className="font-semibold">
        Talk privately
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        One link, one person, encrypted in your browsers and written down nowhere.
      </p>
    </div>
    <StartChatButton variant="secondary" className="w-full" />
  </section>
);
