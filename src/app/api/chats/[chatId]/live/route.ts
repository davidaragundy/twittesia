import { handleChatLiveRequest } from "@/features/chat/utils/handle-chat-live-request";

// The connection is held for as long as one of these lasts, then the browser opens the next;
// Fluid Compute bills the time it spends working rather than the time it waits
export const maxDuration = 300;

export const GET = handleChatLiveRequest;
