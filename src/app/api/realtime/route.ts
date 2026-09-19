import { handleRealtimeRequest } from "@/features/posts/utils/handle-realtime-request";

// The stream is held open for as long as the SDK keeps one connection, then the browser opens
// the next; Fluid Compute bills the time it spends working rather than the time it waits
export const maxDuration = 300;

export const GET = handleRealtimeRequest;
