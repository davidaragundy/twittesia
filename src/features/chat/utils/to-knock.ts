import type { Knock } from "@/features/chat/types/knock";

interface Props {
  identityId: string;
  // One field of the knocks hash, written by the app as JSON
  value: string;
}

// Someone waiting to be let in, or null for a field that no longer reads as one
export const toKnock = ({ identityId, value }: Props): Knock | null => {
  const knock = JSON.parse(value || "null") as {
    handle?: string;
    name?: string;
    knockedAt?: number;
  } | null;

  if (!knock?.handle) return null;

  return {
    identityId,
    handle: knock.handle,
    name: knock.name ?? "",
    knockedAt: new Date(Number(knock.knockedAt)),
  };
};
