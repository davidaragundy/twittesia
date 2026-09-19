import type { Identity } from "@/features/auth/types/identity";

interface Props {
  // An identity hash as a record of strings, or null if it has expired
  hash: Record<string, string> | null;
}

export const toIdentity = ({ hash }: Props): Identity | null => {
  if (!hash?.id || !hash.handle || !hash.name || !hash.createdAt) return null;

  return { id: hash.id, handle: hash.handle, name: hash.name, createdAt: Number(hash.createdAt) };
};
