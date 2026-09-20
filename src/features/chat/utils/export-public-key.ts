import { toBase64Url } from "@/features/chat/utils/to-base64url";

interface Props {
  key: CryptoKey;
}

// The half of the pair that goes on the channel for the other side to use
export const exportPublicKey = async ({ key }: Props) =>
  toBase64Url({ bytes: new Uint8Array(await crypto.subtle.exportKey("raw", key)) });
