import { SeededAvatar } from "@/shared/components/seeded-avatar";

import type { ChatParticipant } from "@/features/chat/types/chat-participant";

interface Props {
  // The other person: a chat only ever has one
  other: ChatParticipant;
}

// Where the conversation happens. It carries no messages yet: they arrive with the chat's own
// connection, which is the next thing built.
export const ChatRoom = ({ other }: Props) => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <SeededAvatar seed={other.handle} className="size-16" />
    <div className="flex flex-col gap-1">
      <p className="font-medium">You and {other.name} are in</p>
      <p className="[font-feature-settings:'calt'_0] text-sm text-muted-foreground">
        @{other.handle}
      </p>
    </div>
    <p className="max-w-sm text-sm text-muted-foreground">
      Nobody else can reach this chat: the invite is spent. Saying something to each other is the
      next thing being built.
    </p>
  </div>
);
