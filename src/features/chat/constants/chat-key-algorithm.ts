// The curve the two sides agree over. P-256 because every browser's WebCrypto has it, so the
// handshake needs nothing shipped with the page.
export const CHAT_KEY_ALGORITHM = { name: "ECDH", namedCurve: "P-256" } as const;
