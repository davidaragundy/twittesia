// A number in [0, 1) from the platform's cryptographic generator
export const getSecureRandom = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
