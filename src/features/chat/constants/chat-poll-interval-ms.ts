// How often a chat waiting for someone asks whether anything has changed. Knocking and accepting
// are rare, so this is the cheapest thing that still feels immediate; once two people are in, the
// page has the chat's own connection and stops asking.
export const CHAT_POLL_INTERVAL_MS = 3_000;
