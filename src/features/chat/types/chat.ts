import type { ChatParticipant } from "@/features/chat/types/chat-participant";

// A chat is open until someone is accepted into it, and holds two people after that. Nothing of
// what is said in it is part of this, or of anything else that is stored.
export type Chat = {
  id: string;
  creator: ChatParticipant;
  guest: ChatParticipant | null;
  createdAt: Date;
  expiresAt: Date;
};
