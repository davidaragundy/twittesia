import { HANDLE_ADJECTIVES } from "@/features/auth/constants/handle-adjectives";
import { HANDLE_NOUNS } from "@/features/auth/constants/handle-nouns";

// Bits of randomness in the suffix. 55 adjectives x 47 nouns x 2^30 is around 3 x 10^12 handles,
// so a collision against the unique constraint on `user.username` is not worth a retry loop: it
// would surface as a failed start, and arriving again produces a different handle.
const SUFFIX_BITS = 30;
// 2^30 in base 36 is at most six characters
const SUFFIX_LENGTH = 6;

// Scales a random 32-bit value into the list rather than taking a modulo, so no word is favoured
// by more than a rounding error
const pick = <T>(values: readonly T[]): T =>
  values[Math.floor(values.length * (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32))];

/**
 * A handle nobody chose: two words and a random suffix, as `sneaky-waffle-x7k3qa`. It is the
 * username, so it is what `/@handle` resolves and what a profile shows.
 *
 * Usernames are capped at 30 characters, and the longest adjective and noun together already
 * reach it with the hyphens and suffix. A longer word in either list makes some handles invalid.
 */
export const generateHandle = (): string => {
  const suffix = (crypto.getRandomValues(new Uint32Array(1))[0] % 2 ** SUFFIX_BITS)
    .toString(36)
    .padStart(SUFFIX_LENGTH, "0");

  return `${pick(HANDLE_ADJECTIVES)}-${pick(HANDLE_NOUNS)}-${suffix}`;
};
