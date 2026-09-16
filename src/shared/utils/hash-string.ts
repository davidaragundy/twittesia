// FNV-1a: the same 32-bit hash on the server and in the browser
export const hashString = (value: string) => {
  let hash = 0x811c9dc5;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
};
