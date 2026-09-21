// How often an open room says again that it is here, so a room that went without a word (a
// closed laptop, a dropped connection nothing noticed) stops counting as here soon after
export const CHAT_PRESENCE_INTERVAL_MS = 10_000;
