interface Props {
  value: string;
}

export const fromBase64 = ({ value }: Props) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
