import { CHAT_CIPHER_ALGORITHM } from "@/features/chat/constants/chat-cipher-algorithm";
import { fromBase64Url } from "@/features/chat/utils/from-base64url";

interface Props {
  key: CryptoKey;
  cipher: string;
  iv: string;
}

// The other side's message, or null for anything this key cannot open — which is what tampering,
// a stale key or someone else's message all look like
export const decryptMessage = async ({ key, cipher, iv }: Props) => {
  try {
    const body = await crypto.subtle.decrypt(
      { name: CHAT_CIPHER_ALGORITHM.name, iv: fromBase64Url({ value: iv }).buffer as ArrayBuffer },
      key,
      fromBase64Url({ value: cipher }).buffer as ArrayBuffer,
    );

    return new TextDecoder().decode(body);
  } catch {
    return null;
  }
};
