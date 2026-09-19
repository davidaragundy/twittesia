import { RANDOM_STRING_ALPHABET } from "@/features/auth/constants/random-string-alphabet";

// 24 characters of 5 bits each: 120 bits from the platform's cryptographic generator. Each byte's
// top 5 bits pick a character, which keeps every character equally likely.
export const generateRandomString = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(24));

  return Array.from(bytes, (byte) => RANDOM_STRING_ALPHABET[byte >> 3]).join("");
};
