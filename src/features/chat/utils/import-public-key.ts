import { CHAT_KEY_ALGORITHM } from "@/features/chat/constants/chat-key-algorithm";
import { fromBase64Url } from "@/features/chat/utils/from-base64url";

interface Props {
  value: string;
}

// The other side's public key, as it arrived. Anything that isn't one throws, and the handshake
// simply doesn't finish.
export const importPublicKey = ({ value }: Props) =>
  crypto.subtle.importKey(
    "raw",
    fromBase64Url({ value }).buffer as ArrayBuffer,
    CHAT_KEY_ALGORITHM,
    true,
    [],
  );
