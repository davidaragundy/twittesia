import type { Chat } from "@/features/chat/types/chat";

interface Props {
  // A chat hash as a record of strings, exactly as HGETALL returns it
  hash: Record<string, string> | null | undefined;
}

// A chat as its two sides read it, or null for anything that isn't one
export const toChat = ({ hash }: Props): Chat | null => {
  if (!hash?.id || !hash.creatorId) return null;

  return {
    id: hash.id,
    creator: {
      id: hash.creatorId,
      handle: hash.creatorHandle ?? "",
      name: hash.creatorName ?? "",
    },
    guest: hash.guestId
      ? { id: hash.guestId, handle: hash.guestHandle ?? "", name: hash.guestName ?? "" }
      : null,
    createdAt: new Date(Number(hash.createdAt)),
    expiresAt: new Date(Number(hash.expiresAt)),
  };
};
