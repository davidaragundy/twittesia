interface Props {
  bytes: Uint8Array;
}

// Base64url, so a key or a nonce survives being put in JSON, in a URL, or read out by a person
export const toBase64Url = ({ bytes }: Props) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
