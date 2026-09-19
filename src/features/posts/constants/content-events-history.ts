// How much of the stream is kept for a page that reconnects: a few minutes of events, and never
// more than one screen's worth, since anything missed is read again from the store anyway
export const CONTENT_EVENTS_HISTORY = { maxLength: 100, expireAfterSecs: 600 };
