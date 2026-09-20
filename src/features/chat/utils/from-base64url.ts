interface Props {
  value: string;
}

export const fromBase64Url = ({ value }: Props) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");

  return Uint8Array.from(atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "=")), (character) =>
    character.charCodeAt(0),
  );
};
