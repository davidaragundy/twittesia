import { getSecureRandom } from "@/shared/utils/get-secure-random";
import { pickValue } from "@/shared/utils/pick-value";

import { HANDLE_ADJECTIVES } from "@/features/auth/constants/handle-adjectives";
import { HANDLE_NOUNS } from "@/features/auth/constants/handle-nouns";
import { HANDLE_SUFFIX_BITS } from "@/features/auth/constants/handle-suffix-bits";
import { HANDLE_SUFFIX_LENGTH } from "@/features/auth/constants/handle-suffix-length";

// As `sneaky-waffle-x7k3qa`. The longest words reach the 30-character username limit exactly.
export const generateHandle = (): string => {
  const adjective = pickValue({ values: HANDLE_ADJECTIVES, random: getSecureRandom });
  const noun = pickValue({ values: HANDLE_NOUNS, random: getSecureRandom });
  const suffix = Math.floor(getSecureRandom() * 2 ** HANDLE_SUFFIX_BITS)
    .toString(36)
    .padStart(HANDLE_SUFFIX_LENGTH, "0");

  return `${adjective}-${noun}-${suffix}`;
};
