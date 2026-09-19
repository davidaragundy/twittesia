import { SESSION_SECRET_ALPHABET } from "@/features/auth/constants/session-secret-alphabet";

// A session's secret: a credential rather than an id, so it is pure randomness with no timestamp in
// it. 24 characters of 5 bits each: 120 bits from the platform's cryptographic generator. Each byte's
// top 5 bits pick a character, which keeps every character equally likely.
export const generateSessionSecret = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(24));

  return Array.from(bytes, (byte) => SESSION_SECRET_ALPHABET[byte >> 3]).join("");
};
