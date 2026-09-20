import { CHAT_CIPHER_ALGORITHM } from "@/features/chat/constants/chat-cipher-algorithm";
import { CHAT_CIPHER_IV_BYTES } from "@/features/chat/constants/chat-cipher-iv-bytes";
import { toBase64Url } from "@/features/chat/utils/to-base64url";

interface Props {
  key: CryptoKey;
  body: string;
}

// What leaves the browser: a nonce and a box nothing between here and the other page can open
export const encryptMessage = async ({ key, body }: Props) => {
  const iv = crypto.getRandomValues(new Uint8Array(CHAT_CIPHER_IV_BYTES));

  const cipher = await crypto.subtle.encrypt(
    { name: CHAT_CIPHER_ALGORITHM.name, iv },
    key,
    new TextEncoder().encode(body),
  );

  return { cipher: toBase64Url({ bytes: new Uint8Array(cipher) }), iv: toBase64Url({ bytes: iv }) };
};
