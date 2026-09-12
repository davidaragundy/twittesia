import { HANDLE_ADJECTIVES } from "@/features/auth/constants/handle-adjectives";
import { HANDLE_NOUNS } from "@/features/auth/constants/handle-nouns";

// Bits of randomness in the suffix. 60 adjectives x 50 nouns x 2^30 is around 3 x 10^12 handles,
// so a collision against the unique constraint on `user.username` is not worth a retry loop: it
// would surface as a failed sign-in, and arriving again produces a different handle.
const SUFFIX_BITS = 30;
const SUFFIX_LENGTH = 6;

const pick = <T>(values: readonly T[]): T => {
  // Rejection-free because the range is a power of two: every value is equally likely, which
  // Math.random() modulo a list length is not
  const bucket = Math.floor(
    values.length * (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32),
  );

  return values[bucket];
};

/**
 * A handle nobody chose: two words and a random suffix, as `swift-otter-x7k3qa`. It is the
 * username, so it is what `/@handle` resolves and what a profile shows.
 */
export const generateHandle = (): string => {
  const suffix = (crypto.getRandomValues(new Uint32Array(1))[0] % 2 ** SUFFIX_BITS)
    .toString(36)
    .padStart(SUFFIX_LENGTH, "0");

  return `${pick(HANDLE_ADJECTIVES)}-${pick(HANDLE_NOUNS)}-${suffix}`;
};
