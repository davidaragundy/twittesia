// How much randomness the part of an invite after `#` carries. It never reaches a server, and a
// later slice derives the key that encrypts the chat from it, so it is as long as that key.
export const INVITE_SECRET_BYTES = 32;
