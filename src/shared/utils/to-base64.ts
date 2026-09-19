interface Props {
  bytes: Uint8Array;
}

export const toBase64 = ({ bytes }: Props) => btoa(String.fromCharCode(...bytes));
