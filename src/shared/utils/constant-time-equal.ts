interface Props {
  a: Uint8Array;
  b: Uint8Array;
}

// Compares every byte whatever it finds, so how long a comparison takes says nothing about how
// much of a secret was right
export const constantTimeEqual = ({ a, b }: Props) => {
  if (a.byteLength !== b.byteLength) return false;

  let difference = 0;

  for (let index = 0; index < a.byteLength; index++) difference |= a[index]! ^ b[index]!;

  return difference === 0;
};
