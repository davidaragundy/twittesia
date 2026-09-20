import { SAFETY_NUMBER_GROUP_DIGITS } from "@/features/chat/constants/safety-number-group-digits";
import { SAFETY_NUMBER_GROUPS } from "@/features/chat/constants/safety-number-groups";

interface Props {
  // The two public keys, in whatever order this side has them
  keys: string[];
  secret: string;
}

/**
 * The number both sides show, for two people to read out loud and compare.
 *
 * It is a fingerprint of the two public keys and the invite's secret, so it only matches when
 * both sides hold the same three things. Anyone who put themselves in the middle would have
 * handed out a different key, and the numbers would not match.
 *
 * The keys are sorted, so each side arrives at the same number from its own point of view.
 */
export const toSafetyNumber = async ({ keys, secret }: Props) => {
  const material = `${[...keys].sort().join(":")}:${secret}`;
  const digest = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(material)),
  );

  return Array.from({ length: SAFETY_NUMBER_GROUPS }, (_, group) =>
    Array.from({ length: SAFETY_NUMBER_GROUP_DIGITS }, (_, digit) =>
      String(digest[group * SAFETY_NUMBER_GROUP_DIGITS + digit] % 10),
    ).join(""),
  ).join(" ");
};
