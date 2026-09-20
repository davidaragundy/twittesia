import { CHAT_CIPHER_ALGORITHM } from "@/features/chat/constants/chat-cipher-algorithm";
import { CHAT_KEY_ALGORITHM } from "@/features/chat/constants/chat-key-algorithm";
import { fromBase64Url } from "@/features/chat/utils/from-base64url";

interface Props {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  // The secret half of the invite, which no server has ever seen
  secret: string;
  chatId: string;
}

/**
 * The key this chat is encrypted with, from what the two sides exchanged and what only they have.
 *
 * The exchange alone would leave whoever relays it able to hand each side its own public key and
 * read everything in between. The invite's secret goes in as the salt, so that attack needs the
 * part of the link browsers never send. The chat's id goes in as well, so a key derived for one
 * chat is no use in another.
 */
export const deriveChatKey = async ({ privateKey, publicKey, secret, chatId }: Props) => {
  const shared = await crypto.subtle.deriveBits(
    { ...CHAT_KEY_ALGORITHM, public: publicKey },
    privateKey,
    256,
  );

  const material = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);

  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: fromBase64Url({ value: secret }).buffer as ArrayBuffer,
      info: new TextEncoder().encode(`twittesia:chat:${chatId}`),
    },
    material,
    CHAT_CIPHER_ALGORITHM,
    false,
    ["encrypt", "decrypt"],
  );
};
