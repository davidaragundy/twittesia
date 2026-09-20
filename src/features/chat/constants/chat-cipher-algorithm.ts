// What a message is encrypted with. AES-GCM authenticates as well as encrypts, so a message
// tampered with on the way fails to open rather than opening into something else.
export const CHAT_CIPHER_ALGORITHM = { name: "AES-GCM", length: 256 } as const;
